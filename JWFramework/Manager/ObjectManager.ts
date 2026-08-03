import * as THREE from 'three';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AIM9H } from '../Object/InGameObject/Weapons/IRMissile/AIM9H';
import { AIM9L } from '../Object/InGameObject/Weapons/IRMissile/AIM9L';
import { Cloud } from '../Object/InGameObject/Environment/Cloud';
import { CollisionManager } from './CollisionManager';
import { EditObject } from '../Object/EditObject/EditObject';
import type { GameObject } from '../Object/GameObject';
import { HeightmapTerrain } from '../Object/CommonObject/Terrain/HeightmapTerrain';
import { InputManager } from './InputManager';
import type { ObjectSet } from '../define';
import { ObjectType } from '../enum';
import { R60M } from '../Object/InGameObject/Weapons/IRMissile/R60M';
import { SceneManager } from './SceneManager';
import { Water } from '../Object/InGameObject/Environment/Water';


export class ObjectManager
{
    private objectId: number = 0;
    private static instance: ObjectManager;

    public constructor(){}

    static getInstance()
    {
        if (!ObjectManager.instance) {
            ObjectManager.instance = new ObjectManager;
        }
        return ObjectManager.instance;
    }

    public GetObjectsFromType() { }

    public GetObjectFromName(name: string): GameObject
    {
        for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
            for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                if (name == this.objectList[TYPE][OBJ].GameObject.Name) {
                    return this.objectList[TYPE][OBJ].GameObject;
                }
            }
        }
        return null;
    }

    public get GetObjectList()
    {
        return this.objectList;
    }

    public get PickableObjectList()
    {
        const obj2d = this.objectList[ObjectType.OBJ_OBJECT2D].filter(o_ => o_.GameObject.IsClone);
        const obj3d = this.objectList[ObjectType.OBJ_OBJECT3D].filter(o_ => o_.GameObject.IsClone);
        const water = this.objectList[ObjectType.OBJ_WATER].filter(o_ => o_.GameObject.IsClone);
        return obj2d.concat(obj3d).filter(o_ => !o_.Name.includes("cloud") && o_.GameObject.IsClone).concat(water);
    }

    public ClearExportObjectList()
    {
        this.exportObjectList = [];
        this.exportObjectList.length = 0;
    }

    public AddObject(gameObject: GameObject, name: string, type: ObjectType)
    {
        this.objectList[type].push({ GameObject: gameObject, Name: name });
        if (gameObject.IsClone == true && type != ObjectType.OBJ_CAMERA) {
            SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
        }
    }

    public DetachObject(gameObject: GameObject, type: ObjectType)
    {
        this.objectList[type] = this.objectList[type].filter((element) => element.GameObject !== gameObject);
        SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
    }

    public MakeClone(selectObject: GameObject): GameObject
    {
        let cloneObject: GameObject;

        //해당 인스턴스로 생성이 가능한지 판별
        if (selectObject instanceof EditObject) {
            cloneObject = new EditObject;
        }
        else if (selectObject instanceof AIM9H)
        {
            cloneObject = new AIM9H;
        }
        else if (selectObject instanceof AIM9L)
        {
            cloneObject = new AIM9L;
        }
        else if (selectObject instanceof R60M)
        {
            cloneObject = new R60M;
        }
        else if (selectObject instanceof Cloud)
        {
            cloneObject = new Cloud;
        }
        else if (selectObject instanceof Water)
        {
            cloneObject = new Water;
        }
        else {
            if (selectObject == null)
                alert("EmptyObject")
            else
                alert(selectObject.Name.toUpperCase() + " Instance of class name not found");
            return;
        }

        cloneObject.IsClone = true;
        cloneObject.Name = selectObject.Name + "Clone" + this.objectId;
        if (selectObject.ModelData != null)
        {
            if (selectObject.ModelData.animations.length != 0)
            {
                cloneObject.ModelData = selectObject.ModelData;
                cloneObject.GameObjectInstance = skeletonClone(cloneObject.ModelData.scene);
                cloneObject.AnimationMixer = new THREE.AnimationMixer(cloneObject.GameObjectInstance);
                cloneObject.AnimationMixer.clipAction(cloneObject.ModelData.animations[0]).play();
            }
            else
                cloneObject.GameObjectInstance = selectObject.GameObjectInstance.clone();
        }
        cloneObject.InitializeAfterLoad();
        this.objectId++;
        return cloneObject;
    }

    public MakeJSONArray()
    {
        for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
            for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                if (this.objectList[TYPE][OBJ].GameObject.IsClone == true || this.objectList[TYPE][OBJ].GameObject.Type == ObjectType.OBJ_TERRAIN)
                {
                    if (this.objectList[TYPE][OBJ].GameObject.ExportComponent != undefined)
                        this.exportObjectList.push(this.objectList[TYPE][OBJ].GameObject.ExportComponent.MakeJsonObject())
                }
            }
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(this.exportObjectList, null, 2)], {
            type: "text/plain"
        }));
        a.setAttribute("download", "Scene.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.ClearExportObjectList();
    }
    
    public DeleteObject(gameObject: GameObject)
    {
        gameObject.GameObjectInstance.traverse(node =>
        {
            if (node.isMesh || node.isGroup || node.isSprite)
            {
                if (node.geometry)
                {
                    node.geometry.dispose();
                }
                if (node.material)
                    if (Array.isArray(node.material))
                    {
                        for (let i = 0; i < node.material.length; ++i)
                        {
                            node.material[i].dispose();
                            if (node.material[i].map)
                                node.material[i].map.dispose();
                        }
                    }
                    else
                    {
                        node.material.dispose();
                        if (node.material.map)
                            node.material.map.dispose();
                    }
            }
        });
        if (gameObject instanceof HeightmapTerrain)
        {
            (gameObject as HeightmapTerrain).inSectorObject = [];
            (gameObject as HeightmapTerrain).inSectorObject = null;
        }
        if (gameObject.CollisionComponent != undefined)
            gameObject.CollisionComponent.DeleteCollider();
        gameObject.DeleteAllComponent();

        delete gameObject.ModelData;
        gameObject.ModelData = null;
        delete gameObject.GameObjectInstance.children;
        gameObject.GameObjectInstance.removeFromParent();
        SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
        delete gameObject.GameObjectInstance;
        gameObject.GameObjectInstance = null;
        gameObject = null;
        this.ClearExportObjectList();
    }

    public DeleteAllObject()
    {
        this.objectList.forEach(function (type)
        {
            type.forEach(function (object)
            {
                if (object.GameObject.Type != ObjectType.OBJ_CAMERA && object.GameObject.IsClone == true)
                {
                    //ObjectManager.getInstance().DeleteObject(object.GameObject);
                    object.GameObject.IsDead = true;
                }
            })
        })
    }

    private RenderOffObject() { }

    public Animate()
    {
        // 지난 프레임의 섹터 등록을 삭제 처리보다 **먼저** 비운다.
        // 뒤에 두면 이번 프레임에 파괴된 터레인(DeleteObject 가 inSectorObject 를 null 로 만든다)을
        // 참조한 채로 접근하게 된다 — 씬 재로드에서 터진다.
        this.ClearTerrainSector();

        for (let TYPE = 0; TYPE < ObjectType.OBJ_END; ++TYPE) {
            for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {

                if (this.objectList[TYPE][OBJ].GameObject.IsClone)
                    this.objectList[TYPE][OBJ].GameObject.Animate();

                //if (this.objectList[TYPE][OBJ].GameObject.PhysicsCompIncluded == true)
                //    this.objectList[TYPE][OBJ].GameObject.PhysicsComponent.UpdateMatrix();

                if (this.objectList[TYPE][OBJ] != null)
                if (this.objectList[TYPE][OBJ].GameObject.IsDead) {
                    this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                    this.objectList[TYPE][OBJ] = null;
                    delete this.objectList[TYPE][OBJ];
                     
                    this.objectList[TYPE] = this.objectList[TYPE].filter((element) => element !== undefined);
                }
            }
        }
        //CollisionManager.getInstance().CollideBoxToBox(this.objectList[ObjectType.OBJ_TERRAIN], this.objectList[ObjectType.OBJ_CAMERA]);
        //CollisionManager.getInstance().CollideObbToObb(this.objectList[ObjectType.OBJ_OBJECT3D], this.objectList[ObjectType.OBJ_OBJECT3D]);

        this.BuildTerrainSector();

        CollisionManager.getInstance().CollideRayToTerrain(this.sectoredTerrain);
        CollisionManager.getInstance().CollideRayToWater(this.objectList[ObjectType.OBJ_WATER].filter(o_ => o_.GameObject.IsClone));
        for (let i = 0; i < this.sectoredTerrain.length; ++i)
        {
            const inSectorObject = this.sectoredTerrain[i].inSectorObject;
            CollisionManager.getInstance().CollideSphereToSphere(inSectorObject, inSectorObject);
        }
        InputManager.getInstance().UpdateKey();
    }

    /** 지난 프레임 등록을 비운다. 등록이 있었던 타일만 건드린다. */
    private ClearTerrainSector()
    {
        for (let i = 0; i < this.sectoredTerrain.length; ++i)
            this.sectoredTerrain[i].ClearSector();
        this.sectoredTerrain.length = 0;
    }

    /**
     * 광역 페이즈 — 오브젝트를 자기가 걸치는 터레인 타일에 등록한다.
     *
     * 예전에는 오브젝트마다 비-dummy 타일 324장 전부와 sphere-box 를 검사했다.
     * 격자가 규칙적이라 좌표에서 인덱스를 바로 구할 수 있으므로 검사 자체가 필요 없다.
     *
     * 매 프레임 비우고 다시 채운다. 예전 방식은 겹치지 않는 타일마다
     * CollisionDeActive() 를 불러 등록을 지웠는데, 그게 곧 전수 루프였다.
     */
    private BuildTerrainSector()
    {
        this.RegisterToTerrainSector(this.objectList[ObjectType.OBJ_OBJECT3D]);
        this.RegisterToTerrainSector(this.objectList[ObjectType.OBJ_MISSILE]);
    }

    private RegisterToTerrainSector(source: ObjectSet[])
    {
        const terrainList = this.objectList[ObjectType.OBJ_TERRAIN];

        for (let i = 0; i < source.length; ++i)
        {
            const gameObject = source[i].GameObject;
            if (gameObject.IsClone == false || gameObject.CollisionComponent == null)
                continue;

            const sphere = gameObject.CollisionComponent.BoundingSphere;
            if (sphere == null)
                continue;

            // 스피어가 걸치는 타일에 **전부** 등록해야 타일 경계를 넘는 충돌이 유지된다.
            // y 는 보지 않는다 — 예전에는 타일 AABB 의 y 범위(-500~4500)에 걸려
            // 고도 4500 위의 오브젝트가 어느 섹터에도 못 들어갔다.
            const minJ = HeightmapTerrain.WorldToGridAxis(sphere.center.x - sphere.radius);
            const maxJ = HeightmapTerrain.WorldToGridAxis(sphere.center.x + sphere.radius);
            const minI = HeightmapTerrain.WorldToGridAxis(sphere.center.z - sphere.radius);
            const maxI = HeightmapTerrain.WorldToGridAxis(sphere.center.z + sphere.radius);

            for (let gridI = minI; gridI <= maxI; ++gridI)
            {
                for (let gridJ = minJ; gridJ <= maxJ; ++gridJ)
                {
                    const index = HeightmapTerrain.GridToTerrainIndex(gridI, gridJ);
                    if (index < 0 || terrainList[index] == undefined)
                        continue;

                    const terrain = terrainList[index].GameObject as unknown as HeightmapTerrain;
                    // objectList[OBJ_TERRAIN][k].terrainIndex == k 가 전제다.
                    // 씬 재로드 중 배열이 압축되는 프레임에는 어긋날 수 있으므로 확인한다.
                    if (terrain.TerrainIndex != index || terrain.IsDummy)
                        continue;

                    if (terrain.inSector == false)
                        this.sectoredTerrain.push(terrain);
                    terrain.CollisionActive(gameObject);
                }
            }
        }
    }

    public Render() { }

    // 이번 프레임에 오브젝트가 등록된 타일만 담는다. 매 프레임 재사용한다(재할당 없음).
    private sectoredTerrain: HeightmapTerrain[] = [];
    private objectList: ObjectSet[][] = [[], [], [], [], [], [], [],[]];
    private exportObjectList = [];
}
