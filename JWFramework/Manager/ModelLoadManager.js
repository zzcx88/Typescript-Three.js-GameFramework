var JWFramework;
(function (JWFramework) {
    class ModelLoadManager {
        constructor() {
            this.loadComplete = false;
            this.loaderManager = new THREE.LoadingManager;
            this.loaderManager.onLoad = this.SetLoadComplete;
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);
            this.modelNumber = 0;
        }
        static getInstance() {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        }
        SetLoadComplete() {
            this.modelNumber++;
            if (this.modelNumber == JWFramework.ModelSceneEdit.getInstance().ModelNumber)
                this.loadComplete = true;
        }
        get LoadComplete() {
            if (this.loadComplete == true && JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                JWFramework.GUIManager.getInstance().GUI_Select;
            }
            return this.loadComplete;
        }
        LoadSceneTest() {
            this.modeltList = JWFramework.ModelSceneEdit.getInstance().ModelScene;
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
        }
        LoadSceneStage() {
            this.modeltList = JWFramework.ModelSceneStage.getInstance().ModelScene;
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
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
                        //if (n.material.map) n.material.map.anisotropy = 1;
                        //n.material.transparent = true;
                        //n.material.opacity = 0.5;
                        //n.material.alphaTest = 0;
                        //n.material.alphaToCoverage = true;
                        //console.log(n.material);
                    }
                });
                //SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
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
    }
    JWFramework.ModelLoadManager = ModelLoadManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ModelLoadManager.js.map