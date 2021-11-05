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
        }

        private SetLoadComplete() {
            this.loadComplete = true;
        }

        public get LoadComplete(): boolean {
            return this.loadComplete;
        }

        public LoadSceneTest() {
            this.modeltList = ModelSceneTest.getInstance().ModelSceneTest;

            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            } 
        }

        private LoadModel(modelSource: string, gameObject: GameObject) {
            //this.gameobject = gameObject;
            this.gltfLoader.load(modelSource,
                (gltf) => {
                    console.log('success')
                    console.log(gltf)
                    gameObject.GameObjectInstance = gltf.scene;
                    SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
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
        private loadComplete: boolean = false;


        private modeltList:  ModelSet[];
    }
}