var JWFramework;
(function (JWFramework) {
    var ModelLoadManager = /** @class */ (function () {
        function ModelLoadManager() {
            this.gltfLoader = new THREE.GLTFLoader;
        }
        ModelLoadManager.getInstance = function () {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        };
        ModelLoadManager.prototype.LoadModel = function (modelSource, gameObject) {
            var _this = this;
            this.gameobject = gameObject;
            this.gltfLoader.load(modelSource, function (gltf) {
                console.log('success');
                console.log(gltf);
                gltf.scene.scale.set(0.5, 0.5, 0.5);
                _this.gameobject.GameObjectInstance = gltf.scene;
                JWFramework.SceneManager.getInstance().SceneInstance.add(_this.gameobject.GameObjectInstance);
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