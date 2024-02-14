﻿/// <reference path="../Object/CommonObject/Terrain/HeightmapTerrain.ts" />
/// <reference path="../Object/InGameObject/Envirument/Cloud.ts" />
namespace JWFramework
{
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
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);
            this.loadCompletModel = 0;
        }

        private SetLoadComplete()
        {
            this.loadCompletModel++;
            if (this.loadCompletModel == this.modelCount)
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
                this.modeltList = ModelSceneBase.getInstance("ModelSceneEdit").ModelScene;
                this.modelCount = ModelSceneBase.getInstance("ModelSceneEdit").ModelNumber;
            }

            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain(20, 20);
        }

        public LoadSceneStage()
        {
            this.modeltList = ModelSceneStage.getInstance().ModelScene;
            this.modelCount = ModelSceneStage.getInstance().ModelNumber;
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain();
        }

        private LoadModel(modelSource: string, gameObject: GameObject)
        {
            if (modelSource != null)
            {
                this.gltfLoader.load(modelSource,
                    (gltf) =>
                    {
                        console.log('success')
                        gameObject.ModelData = gltf;
                        (gltf.scene as any).traverse(n =>
                        {
                            if (n.isMesh)
                            {
                                let texture = n.material.map;
                                let normal = n.material.normalMap;
                                let opacity = n.material.opacity;
                                let color: THREE.Color = n.material.color;
                                let side = n.material.side;
                                let roughness = n.material.roughness
                                let metalness = n.material.metalness
                                n.material.map = texture;
                                n.material.normalMap = normal;
                                n.material.color = color;
                                n.material.roughness = roughness;
                                n.material.metalness = metalness;
                                n.material.envMap = SceneManager.getInstance().SceneInstance.environment;
                                n.castShadow = true;
                                n.receiveShadow = true;
                                if (opacity != 1)
                                {
                                    n.material.opacity = opacity;
                                }
                                n.material.side = side;
                            }
                        });
                        gameObject.GameObjectInstance = gltf.scene;
                        gameObject.InitializeAfterLoad();
                        this.SetLoadComplete();
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
                    });
            }
            else
            {
                gameObject.InitializeAfterLoad();
                this.SetLoadComplete();
            }
        }

        public LoadHeightmapTerrain(row: number = 20, col: number = 20)
        {
            let terrainIndex = 0; // 추가된 부분
            for (let i = 0; i < col; ++i)
            {
                for (let j = 0; j < row; ++j)
                {
                    let terrainX = j * 900;
                    let terrainY = i * 900;
                    let terrainWidth = 16;
                    let terrainHeight = 16;
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
                    let objectManager = ObjectManager.getInstance();
                    for (let data of jsondata)
                    {
                        if (data.name.includes("Terrain"))
                        {
                            let terrain = objectManager.GetObjectFromName(data.name);
                            if (data.isDummy != undefined)
                                (terrain as unknown as HeightmapTerrain).IsDummy = data.isDummy;
                            for (let i = 0; i < data.vertexIndex.length; ++i)
                            {
                                (terrain as unknown as HeightmapTerrain).SetHeight(data.vertexIndex[i], data.vertexHeight[i], TerrainOption.TERRAIN_LOAD);
                            }
                        }
                        else if (data.name.includes("MIG_29"))
                        {
                            let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("MIG_29"));
                            cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                            cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                            cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                            if (data.obbSize != null)
                                cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                            objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                        }
                        else if (data.name.includes("F-5E"))
                        {
                            let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("F-5E"));
                            cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                            cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                            cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                            cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                            objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                        }
                        else if (data.name.includes("Water"))
                        {
                            let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("Water"));
                            cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                            //cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                            cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                            objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                        }
                        else if (data.name.includes("AIM-9"))
                        {
                            let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("AIM-9"));
                            cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                            cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                            cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                            objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                        }
                    }
                });
        }

        private loaderManager: THREE.LoadingManager
        private gltfLoader: THREE.GLTFLoader;

        private loadCompletModel: number;
        private modelCount: number;
        private loadComplete: boolean = false;

        private modeltList: ModelSet[];
        private terrain: HeightmapTerrain[] = [];
    }
}