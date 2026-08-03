import * as THREE from 'three';
import { CameraManager } from '../../../Manager/CameraManager';
import { CameraMode, ObjectType, PickMode, TerrainOption } from '../../../enum';
import { CollisionComponent } from '../../../Component/CollisionComponent';
import { ExportComponent } from '../../../Component/ExportComponent';
import { GameObject } from '../../GameObject';
import { GraphicComponent } from '../../../Component/GraphicComponent';
import { ObjectManager } from '../../../Manager/ObjectManager';
import { PhysicsComponent } from '../../../Component/PhysicsComponent';
import { SceneManager } from '../../../Manager/SceneManager';
import { ShaderManager } from '../../../Manager/ShaderManager';
import { WorldManager } from '../../../Manager/WorldManager';


export class HeightmapTerrain extends GameObject
{
    constructor(x: number, z: number, segmentWidth: number, segmentHeight: number, planSize: number = 900, isDummy: boolean = false)
    {
        super();
        this.isDummy = isDummy;
        this.width = x;
        this.height = z;
        this.planSize = planSize;
        this.segmentWidth = segmentWidth;
        this.segmentHeight = segmentHeight;
        this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
        this.terrainIndex = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
        this.type = ObjectType.OBJ_TERRAIN;


        this.isClone = true;

        this.physicsComponent = new PhysicsComponent(this);
        this.graphicComponent = new GraphicComponent(this);
        this.exportComponent = new ExportComponent(this);
        this.collisionComponent = new CollisionComponent(this);

        this.CreateTerrainMesh();
    }

    public InitializeAfterLoad() {
        this.PhysicsComponent.SetPosition(this.width, 0, this.height);

        if (this.isDummy == false)
        {
            this.CreateBoundingBox();
        }
        this.GameObjectInstance.matrixAutoUpdate = false;
        SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
        //SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
        ObjectManager.getInstance().AddObject(this, this.name, this.type);
    }

    public CreateBoundingBox() 
    {
        this.CollisionComponent.CreateBoundingBox(this.planSize, 5000, this.planSize);
        this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2000, this.height), new THREE.Vector3(this.planSize, 5000, this.planSize));
        this.CollisionComponent.BoxHelper.visible = false;
        this.CollisionComponent.BoxHelper.matrixAutoUpdate = false;
    }

    private CreateTerrainMesh()
    {
        if (this.isDummy == false)
            this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, this.segmentWidth, this.segmentHeight);
        else
            this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);

        // fog 유니폼은 UniformsLib 을 그대로 clone 해서 쓴다.
        //
        // 예전 코드는 `fogColor: { value: THREE.UniformsLib['fog'].fogColor }` 였는데,
        // 우변이 이미 `{ value: Color }` 라서 `{ value: { value: Color } }` 로 이중 래핑됐다.
        // 그러면 렌더러의 refreshFogUniforms() 가 `uniforms.fogColor.value.copy(fog.color)` 에서
        // TypeError 를 낸다 → 예전엔 three.js 본체를 `.copy()` → `=` 로 고쳐서 우회했고,
        // 그 대가로 three 버전을 못 올리게 됐다. CLAUDE.md §2① · §7.1
        //
        // clone 이므로 타일마다 자기 fog 유니폼을 갖는다(전역 UniformsLib 을 오염시키지 않는다).
        const customUniforms = {
            ...THREE.UniformsUtils.clone(THREE.UniformsLib['fog']),

            farmTexture: { value: ShaderManager.getInstance().farmTexture },
            mountainTexture: { value: ShaderManager.getInstance().mountainTexture },
            factoryTexture: { value: ShaderManager.getInstance().factoryTexture },
            cityTexture: { value: ShaderManager.getInstance().cityTexture },
            desertTexture: { value: ShaderManager.getInstance().desertTexture },

            cityUVFactor: { value: this.cityUVFactor },
            opacity: { value: this.opacity }
        };
        
        // create custom material from the shader code above
        //   that is within specially labelled script tags
        this.material = new THREE.ShaderMaterial(
            {
                uniforms: customUniforms,
                vertexShader: ShaderManager.getInstance().SplattingShader.vertexShader.slice(),
                fragmentShader: ShaderManager.getInstance().SplattingShader.fragmentShader.slice(),
                //wireframe: true,
                //side: THREE.DoubleSide,
                fog: true,
                transparent: false,
            });

        //this.material.map = this.texture;
        // this.gradientmap = new THREE.TextureLoader().load('Model/Heightmap/fiveTone.jpg');
        // this.gradientmap.minFilter = THREE.NearestFilter;
        // this.gradientmap.magFilter = THREE.NearestFilter;
        // this.material.gradientMap = this.gradientmap;

        //this.material.normalMap = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture_N.png");
        //this.material.wireframe = true;

        const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
        this.planeGeometry.applyMatrix4(rotation);

        this.planeGeometry.computeBoundingSphere();
        this.planeGeometry.computeVertexNormals();

        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.material);
        this.planeMesh.receiveShadow = true;
        this.planeMesh.castShadow = true;

        this.gameObjectInstance = this.planeMesh;
        this.GameObjectInstance.name = this.name;

        this.gameObjectInstance.frustumCulled = true;

        this.InitializeAfterLoad();
    }

    public get HeightIndexBuffer(): number[] {
        return this.heightIndexBuffer;
    }

    public get HeightBuffer(): number[] {
        for (let i = 0; i < this.heightBuffer.length; ++i) {
            this.heightBuffer.pop();
        }
        this.heightBuffer.length = 0;
        this.heightIndexBuffer.forEach(element =>
            this.heightBuffer.push(this.planeGeometry.getAttribute('position').getY(element)));
        return this.heightBuffer;
    }

    public get IsDummy()
    {
        return this.isDummy;
    }

    public set IsDummy(flag: boolean)
    {
        this.isDummy = flag;
    }

    public SetHeight(index: number, value: number = undefined, option: TerrainOption = TerrainOption.TERRAIN_UP)
    {
        if (this.isDummy == true)
        {
            if (this.collisionComponent.BoundingBox != null)
            {
                this.collisionComponent.DeleteCollider();
                this.planeGeometry.dispose();
                this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                this.planeMesh.geometry = this.planeGeometry;
                const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                this.planeGeometry.applyMatrix4(rotation);
                //this.material.wireframe = true;
            }
        }
        this.planeGeometry.getAttribute('position').needsUpdate = true;
        let height: number = this.planeGeometry.getAttribute('position').getY(index);

        if (value != undefined && option == TerrainOption.TERRAIN_UP) {
            value = Math.abs(value);
        }

        if (option == TerrainOption.TERRAIN_DOWN) {
            value = Math.abs(value);
            value *= -1;
            this.planeGeometry.getAttribute('position').setY(index, height += value);
        }
        else if (option == TerrainOption.TERRAIN_BALANCE || option == TerrainOption.TERRAIN_LOAD) {
            this.planeGeometry.getAttribute('position').setY(index, value);
        }
        else {
            this.planeGeometry.getAttribute('position').setY(index, height += value);
        }
        if (this.isDummy == false) {
            const objectList = ObjectManager.getInstance().GetObjectList;
            const endPointIndex = this.planeGeometry.getAttribute('position').count - 1;
            const oldheight: number = this.planeGeometry.getAttribute('position').getY(index);

            if (this.planeGeometry.getAttribute('position').getX(index) == this.planSize / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index - this.segmentHeight, oldheight);

                    if (index == endPointIndex) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)]) {
                            const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(0, oldheight);
                        }
                    }

                    else if (index == this.segmentWidth) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)]) {
                            const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(endPointIndex - this.segmentWidth, oldheight);
                        }
                    }
                }
            }

            if (this.planeGeometry.getAttribute('position').getX(index) == -(this.planSize / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index + this.segmentHeight, oldheight);
                }

                if (index == 0) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)]) {
                        const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(endPointIndex, oldheight);
                    }
                }

                else if (index == endPointIndex - this.segmentWidth) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)]) {
                        const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(this.segmentWidth, oldheight);
                    }
                }
            }

            if (this.planeGeometry.getAttribute('position').getZ(index) == this.planSize / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index - (endPointIndex - this.segmentWidth), oldheight);
                }
            }

            if (this.planeGeometry.getAttribute('position').getZ(index) == -(this.planSize / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index + (endPointIndex - this.segmentWidth), oldheight);
                }
            }
        }

        if (this.heightIndexBuffer.indexOf(index) == -1)
            this.heightIndexBuffer.push(index);
        this.vertexNormalNeedUpdate = true;

        const positionLength = this.planeGeometry.getAttribute('position').count;
        let cnt = 0;
        for (let i = 0; i < positionLength; ++i)
        {
            if (this.planeGeometry.getAttribute('position').getY(i) <= -3)
            {
                this.useDirtTexture = true;
            }
            else if (i == positionLength - 1 && !this.useDirtTexture)
                this.useDirtTexture = false

            if (this.planeGeometry.getAttribute('position').getY(i) == 1)
                ++cnt;
            if (cnt >= 30 && this.physicsComponent.GetMaxVertex().y <= 110)
            {
                this.useCityTexture = true;
                this.material.uniforms.cityUVFactor.value = 6;
            }
            else
            {
                this.useCityTexture = false;
                this.material.uniforms.cityUVFactor.value = 1;
            }
        }

    }

    public CollisionActive(object: GameObject)
    {
        if (this.isDummy == false)
        {
            if (object.Type == ObjectType.OBJ_CAMERA)
            {
                this.cameraInSector = false;
                // this.material.opacity = 1;
            }
            else
            {
                if (this.inSectorObject.includes(object) == false)
                {
                    this.inSectorObject.push(object);
                    //this.opacity = 0.5;
                    //this.material.uniforms['opacity'].value = this.opacity;
                    this.inSector = true;
                }
            }
        }
    }

    public CollisionDeActive(object: GameObject) {
        if (object.Type == ObjectType.OBJ_CAMERA) {
            this.cameraInSector = false;
        }
        else {
            if (this.inSectorObject.includes(object) == true) {
                this.inSectorObject = this.inSectorObject.filter((element) => (element != object)).slice();
            }
        }
    }

    public Animate()
    {
        if (this.isDummy == true)
        {
            if (this.collisionComponent.BoundingBox != null)
            {
                this.collisionComponent.DeleteCollider(); 
                this.planeGeometry.dispose();
                this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                this.planeMesh.geometry = this.planeGeometry;
                const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                this.planeGeometry.applyMatrix4(rotation);
                //this.material.wireframe = true;
            }
        }
        else
        {
            if (this.useDirtTexture)
                this.material.uniforms.factoryTexture.value = ShaderManager.getInstance().desertTexture;
            else
                this.material.uniforms.factoryTexture.value = ShaderManager.getInstance().factoryTexture;
            if (this.useCityTexture)
                this.material.uniforms.cityTexture.value = ShaderManager.getInstance().cityTexture;
            else
                this.material.uniforms.cityTexture.value = ShaderManager.getInstance().farmTexture;
            if (this.collisionComponent.BoundingBox == null)
                this.CreateBoundingBox();
        }

        if (/*SceneManager.getInstance().CurrentScene.Picker.PickMode != PickMode.PICK_TERRAIN &&*/ this.vertexNormalNeedUpdate) {
            this.planeGeometry.computeVertexNormals();
            this.vertexNormalNeedUpdate = false;
        }
        this.inSectorObject = this.inSectorObject.filter((element) => (element.IsDead == false));
        if (this.inSectorObject.length == 0) {
            //this.opacity = 1;
            //this.material.uniforms['opacity'].value = this.opacity;
            this.inSector = false;
        }

        const cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
        if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
            WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
        if (cameraPosition.sub(this.physicsComponent.GetPosition()).length() > 4500)
        {
            this.GameObjectInstance.visible = false;
        }
        else
        {
            this.GameObjectInstance.visible = true;
        }

    }

    private planeMesh: THREE.Mesh;
    private planeGeometry: THREE.PlaneGeometry;
    private material: THREE.ShaderMaterial;

    private terrainIndex: number;
    private width: number;
    private height: number;
    private segmentWidth: number;
    private segmentHeight: number;

    private heightIndexBuffer: number[] = [];
    private heightBuffer: number[] = [];
    public inSectorObject: GameObject[] = [];

    private vertexNormalNeedUpdate: boolean = false;
    private opacity: number = 1;
    private cityUVFactor: number = 1;

    public row: number = 0;
    public col: number = 0;
    private isDummy = false;
    private planSize: number;
    public inSector: boolean = false
    public cameraInSector: boolean = false;
    private useDirtTexture: boolean = false;
    private useCityTexture: boolean = false;
}
