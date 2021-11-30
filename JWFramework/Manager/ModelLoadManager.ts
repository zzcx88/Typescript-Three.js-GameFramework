namespace JWFramework {
    export class ModelLoadManager {

        private static instance: ModelLoadManager;

        static getInstance() {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        }

        public constructor() {
            this.loaderManager = new THREE.LoadingManager;
            this.loaderManager.onLoad = this.SetLoadComplete;
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);

            this.modelNumber = 0;
        }

        private SetLoadComplete() {
            this.modelNumber++;
            if (this.modelNumber == ModelSceneTest.getInstance().ModelNumber)
                this.loadComplete = true;
        }

        public get LoadComplete(): boolean {
            if (this.loadComplete == true) {
                GUIManager.getInstance().GUI_Select;
            }
            return this.loadComplete;
        }

        public LoadSceneTest() {
            this.modeltList = ModelSceneTest.getInstance().ModelSceneTest;

            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            } 
        }

        private LoadModel(modelSource: string, gameObject: GameObject) {
            this.gltfLoader.load(modelSource,
                (gltf) => {
                    console.log('success')
                    console.log(gltf);
                    gameObject.GameObjectInstance = gltf.scene;
                    //gameObject.GameObjectInstance.traverse(n => {
                    //    if (n.isMesh) {
                    //        n.castShadow = true;
                    //        n.receiveShadow = true;
                    //        if (n.material.map) n.material.map.anisotropy = 1;
                    //        n.material.transparent = true;
                    //        n.material.opacity = 0.5;
                    //        n.material.alphaTest = 0;
                    //        //n.material.alphaToCoverage = true;
                    //        console.log(n.material);
                    //    }
                    //});


                    //SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
                    gameObject.InitializeAfterLoad();
                    this.SetLoadComplete();
                },
                (progress) => {
                    console.log('progress')
                    console.log(progress)
                },
                (error) => {
                    console.log('error')
                    console.log(error)
                });
            
        }
        private loaderManager: THREE.LoadingManager
        private gltfLoader: THREE.GLTFLoader;
        private modelNumber: number;
        private loadComplete: boolean = false;

        private modeltList:  ModelSet[];
    }
}