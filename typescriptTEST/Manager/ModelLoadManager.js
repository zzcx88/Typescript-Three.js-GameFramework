var JWFramework;
(function (JWFramework) {
    var ModelLoadManager = /** @class */ (function () {
        function ModelLoadManager() {
            this.loadComplete = false;
            this.loaderManager = new THREE.LoadingManager;
            this.loaderManager.onLoad = this.SetLoadComplete;
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);
            this.modelNumber = 0;
        }
        ModelLoadManager.getInstance = function () {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        };
        ModelLoadManager.prototype.SetLoadComplete = function () {
            this.modelNumber++;
            if (this.modelNumber == JWFramework.ModelSceneTest.getInstance().ModelNumber)
                this.loadComplete = true;
        };
        Object.defineProperty(ModelLoadManager.prototype, "LoadComplete", {
            get: function () {
                return this.loadComplete;
            },
            enumerable: false,
            configurable: true
        });
        ModelLoadManager.prototype.LoadSceneTest = function () {
            this.modeltList = JWFramework.ModelSceneTest.getInstance().ModelSceneTest;
            for (var i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
        };
        ModelLoadManager.prototype.LoadModel = function (modelSource, gameObject) {
            var _this = this;
            this.gltfLoader.load(modelSource, function (gltf) {
                console.log('success');
                console.log(gltf);
                gameObject.GameObjectInstance = gltf.scene;
                JWFramework.SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
                gameObject.InitializeAfterLoad();
                _this.SetLoadComplete();
            }, function (progress) {
                console.log('progress');
                console.log(progress);
            }, function (error) {
                console.log('error');
                console.log(error);
            });
        };
        return ModelLoadManager;
    }());
    JWFramework.ModelLoadManager = ModelLoadManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ModelLoadManager.js.map