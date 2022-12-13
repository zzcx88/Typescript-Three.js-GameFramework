var JWFramework;
(function (JWFramework) {
    class ModelLoadManager {
        constructor() {
            this.loadComplete = false;
            this.terrain = [];
            this.loaderManager = new THREE.LoadingManager;
            this.loaderManager.onLoad = this.SetLoadComplete;
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);
            this.loadCompletModel = 0;
        }
        static getInstance() {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        }
        SetLoadComplete() {
            this.loadCompletModel++;
            if (this.loadCompletModel == this.modelCount)
                this.loadComplete = true;
        }
        get LoadComplete() {
            if (this.loadComplete == true && JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                JWFramework.GUIManager.getInstance().GUI_Select;
            }
            return this.loadComplete;
        }
        LoadScene() {
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                this.modeltList = JWFramework.ModelSceneEdit.getInstance().ModelScene;
                this.modelCount = JWFramework.ModelSceneEdit.getInstance().ModelNumber;
            }
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain();
        }
        LoadModel(modelSource, gameObject) {
            this.gltfLoader.load(modelSource, (gltf) => {
                console.log('success');
                console.log(gltf);
                gameObject.GameObjectInstance = gltf.scene;
                gameObject.GameObjectInstance.traverse(n => {
                    if (n.isMesh) {
                        let texture = n.material.map;
                        let normal = n.material.normalMap;
                        let color = n.material.color;
                        n.material = new THREE.MeshToonMaterial();
                        n.material.map = texture;
                        n.material.normalMap = normal;
                        n.material.color = color;
                        n.castShadow = true;
                        n.receiveShadow = true;
                    }
                });
                gameObject.InitializeAfterLoad();
                this.SetLoadComplete();
            }, (progress) => {
                console.log('progress');
                console.log(progress);
            }, (error) => {
                console.log('error');
                console.log(error);
            });
        }
        LoadHeightmapTerrain() {
            for (let i = 0; i < 10; ++i) {
                for (let j = 0; j < 10; ++j) {
                    this.terrain[i] = new JWFramework.HeightmapTerrain(j * 300, i * 300, 32, 32);
                }
            }
        }
    }
    JWFramework.ModelLoadManager = ModelLoadManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ModelLoadManager.js.map