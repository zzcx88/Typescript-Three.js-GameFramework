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
            this.gltfLoader = new THREE.GLTFLoader;
        }

        public LoadModel(modelSource: string, gameObject: GameObject) {
            this.gameobject = gameObject;
            this.gltfLoader.load(modelSource,
                (gltf) => {
                    console.log('success')
                    console.log(gltf)
                    gltf.scene.scale.set(0.5, 0.5, 0.5);
                    this.gameobject.GameObjectInstance = gltf.scene;
                    SceneManager.getInstance().SceneInstance.add(this.gameobject.GameObjectInstance);

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

        private gameobject: GameObject;
        private gltfLoader: THREE.GLTFLoader;
    }
}