import * as THREE from 'three';
import type { GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUIManager } from './GUIManager';
import { HeightmapTerrain } from '../Object/CommonObject/Terrain/HeightmapTerrain';
import type { ModelSet } from '../define';
import { ModelSceneBase, ModelSceneEdit, ModelSceneStage } from '../define';
import { ObjectManager } from './ObjectManager';
import { SceneManager } from './SceneManager';
import { SceneType, TerrainOption } from '../enum';
import { Water } from '../Object/InGameObject/Environment/Water';


export class ModelLoadManager
{

    private static instance: ModelLoadManager;

    static getInstance()
    {
        if (!ModelLoadManager.instance) {
            ModelLoadManager.instance = new ModelLoadManager;
        }
        return ModelLoadManager.instance;
    }

    public constructor()
    {
        this.loaderManager = new THREE.LoadingManager;
        this.loaderManager.onLoad = this.SetLoadComplete;
        this.gltfLoader = new GLTFLoader(this.loaderManager);
        this.loadCompleteModel = 0;
    }

    private SetLoadComplete()
    {
        this.loadCompleteModel++;
        if (this.loadCompleteModel == this.modelCount)
            this.LoadComplete = true;
    }

    public set LoadComplete(flag: boolean)
    {
        this.loadComplete = flag;
    }

    public get LoadComplete(): boolean
    {
        if (this.loadComplete == true && SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
            GUIManager.getInstance().GUI_Select;
        }
        return this.loadComplete;
    }

    public LoadScene()
    {
        if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT)
        {
            this.modelList = ModelSceneBase.getInstance("ModelSceneEdit").ModelScene;
            this.modelCount = ModelSceneBase.getInstance("ModelSceneEdit").ModelNumber;
        }

        for (let i = 0; i < this.modelList.length; ++i)
        {
            this.LoadModel(this.modelList[i]);
        }
        this.LoadHeightmapTerrain(20, 20);
    }

    public LoadSceneStage()
    {
        this.modelList = ModelSceneStage.getInstance().ModelScene;
        this.modelCount = ModelSceneStage.getInstance().ModelNumber;
        for (let i = 0; i < this.modelList.length; ++i) 
        {
            //this.LoadModel(this.modelList[i].mainUrl, this.modelList[i].model);
        }
        this.LoadHeightmapTerrain();
    }

    private async LoadModel(modelSet: ModelSet)
    {
        if (modelSet.mainUrl != null)
        {
            modelSet.model.ModelData = await this.GLTFLoad(modelSet.mainUrl);

            if (modelSet.lodUrl != null)
            {
                const lodGLTF = await this.GLTFLoad(modelSet.lodUrl);
                modelSet.model.GameObjectInstance = new THREE.LOD();
                const model = modelSet.model.GameObjectInstance as THREE.LOD;
                model.addLevel(modelSet.model.ModelData.scene, 300);
                model.addLevel(lodGLTF.scene, 600);
            } else
                modelSet.model.GameObjectInstance = modelSet.model.ModelData.scene;
            modelSet.model.InitializeAfterLoad();
            this.SetLoadComplete();
        } else
        {
            modelSet.model.InitializeAfterLoad();
            this.SetLoadComplete();
        }
    }

    private GLTFLoad(url: string): Promise<GLTF>
    {
        return new Promise((resolve, reject) =>
        {
            this.gltfLoader.load(url,
                (gltf) =>
                {
                    gltf.scene.traverse(n =>
                    {
                        const node = (n as any);
                        if (node.isMesh)
                        {
                            const texture = node.material.map;
                            const normal = node.material.normalMap;
                            const opacity = node.material.opacity;
                            const color: THREE.Color = node.material.color;
                            const side = node.material.side;
                            const roughness = node.material.roughness
                            const metalness = node.material.metalness
                            node.material.map = texture;
                            node.material.normalMap = normal;
                            node.material.color = color;
                            node.material.roughness = roughness;
                            node.material.metalness = metalness;
                            node.material.envMap = SceneManager.getInstance().SceneInstance.environment;
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (opacity != 1)
                            {
                                node.material.opacity = opacity;
                            }
                            node.material.side = side;
                            n.frustumCulled = true;
                        }
                    });
                    resolve(gltf);
                },
                (progress) =>
                {
                    console.log('progress')
                    console.log(progress)
                },
                (error) =>
                {
                    console.log('error')
                    console.log(error)
                    reject(error);
                });
        });
    }

    public LoadHeightmapTerrain(row: number = 20, col: number = 20)
    {
        let terrainIndex = 0; // 추가된 부분
        for (let i = 0; i < col; ++i)
        {
            for (let j = 0; j < row; ++j)
            {
                const terrainX = j * 900;
                const terrainY = i * 900;
                const terrainWidth = 16;
                const terrainHeight = 16;
                if (i == 0 || i == col - 1 || j == 0 || j == row - 1) // 추가된 부분
                    this.terrain[terrainIndex] = new HeightmapTerrain(terrainX, terrainY, terrainWidth, terrainHeight, 900, true);
                else
                    this.terrain[terrainIndex] = new HeightmapTerrain(terrainX, terrainY, terrainWidth, terrainHeight, 900, false);
                this.terrain[terrainIndex].row = row;
                this.terrain[terrainIndex].col = col;
                terrainIndex++; // 추가된 부분
            }
        }
    }

    public LoadSavedScene()
    {
        fetch("./Model/Scene.json")
            .then(response =>
            {
                return response.json();
            })
            .then(jsondata =>
            {
                const objectManager = ObjectManager.getInstance();
                for (const data of jsondata)
                {
                    if (data.name.includes("Terrain"))
                    {
                        const terrain = objectManager.GetObjectFromName(data.name);
                        if (data.isDummy != undefined)
                            (terrain as unknown as HeightmapTerrain).IsDummy = data.isDummy;
                        for (let i = 0; i < data.vertexIndex.length; ++i)
                        {
                            (terrain as unknown as HeightmapTerrain).SetHeight(data.vertexIndex[i], data.vertexHeight[i], TerrainOption.TERRAIN_LOAD);
                        }
                    }
                    else if (data.name.includes("MIG_29"))
                    {
                        const cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("MIG_29"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPosition(data.position.x, data.position.y, data.position.z);
                        if (data.obbSize != null)
                            cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("F-5E"))
                    {
                        const cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("F-5E"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPosition(data.position.x, data.position.y, data.position.z);
                        cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("Water"))
                    {
                        const cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("Water"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        //cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPosition(data.position.x, data.position.y, data.position.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("AIM-9"))
                    {
                        const cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("AIM-9"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPosition(data.position.x, data.position.y, data.position.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                }
            });
    }

    private loaderManager: THREE.LoadingManager
    private gltfLoader: GLTFLoader;

    private loadCompleteModel: number;
    private modelCount: number;
    private loadComplete: boolean = false;

    private modelList: ModelSet[];
    private terrain: HeightmapTerrain[] = [];
}
