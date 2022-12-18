/// <reference path="../Object/CommonObject/Terrain/HeightmapTerrain.ts" />
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
                this.loadComplete = true;
        }

        public get LoadComplete(): boolean
        {
            if (this.loadComplete == true && SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
                //에디트 모드에서만 DatGUI를 사용함
                GUIManager.getInstance().GUI_Select;
            }
            return this.loadComplete;
        }

        public LoadScene()
        {
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT)
            {
                this.modeltList = ModelSceneEdit.getInstance().ModelScene;
                this.modelCount = ModelSceneEdit.getInstance().ModelNumber;
            }

            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain();
        }

        //public LoadSceneStage()
        //{
        //    this.modeltList = ModelSceneStage.getInstance().ModelScene;
        //    for (let i = 0; i < this.modeltList.length; ++i) {
        //        this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
        //    }
        //    this.LoadHeightmapTerrain();
        //}

        private LoadModel(modelSource: string, gameObject: GameObject)
        {
            this.gltfLoader.load(modelSource,
                (gltf) =>
                {
                    console.log('success')
                    console.log(gltf);
                    gameObject.ModelData = gltf;
                    (gltf.scene as any).traverse(n =>
                    {
                        if (n.isMesh) {
                            let texture = n.material.map;
                            let normal = n.material.normalMap;
                            let color = n.material.color;
                            if (modelSource[modelSource.length - 1] != 'b') {
                                n.material = new THREE.MeshStandardMaterial();
                            }
                            else {
                                n.material = new THREE.MeshPhongMaterial();
                            }
                            n.material.map = texture;
                            n.material.normalMap = normal;
                            n.material.color = color;
                            //n.material.wireframe = true;
                            n.castShadow = true;
                            n.receiveShadow = true;
                            //if (n.material.map) n.material.map.anisotropy = 1;
                            //n.material.transparent = true;
                            //n.material.opacity = 0.5;
                            //n.material.alphaTest = 0;
                            //n.material.alphaToCoverage = true;
                            //console.log(n.material);
                        }
                    });
                    gameObject.GameObjectInstance = gltf.scene;
                    //SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
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

        private LoadHeightmapTerrain()
        {
            for (let i = 0; i < 10; ++i) {
                for (let j = 0; j < 10; ++j) {
                    this.terrain[i] = new HeightmapTerrain(j * 450, i * 450, 32, 32);
                }
            }
        }
        private loaderManager: THREE.LoadingManager
        private gltfLoader: THREE.GLTFLoader;
        //animetionTest
        public animationMixer: THREE.AnimationMixer = null;
        public anim;
        ////////////
        private loadCompletModel: number;
        private modelCount: number;
        private loadComplete: boolean = false;

        private modeltList: ModelSet[];
        private terrain = [];
    }
}