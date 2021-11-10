var JWFramework;
(function (JWFramework) {
    var Define = /** @class */ (function () {
        function Define() {
        }
        Define.SCREEN_WIDTH = window.innerWidth;
        Define.SCREEN_HEIGHT = window.innerHeight;
        return Define;
    }());
    JWFramework.Define = Define;
    var ModelSceneTest = /** @class */ (function () {
        function ModelSceneTest() {
            this.helmet = new JWFramework.TestObject;
            this.F16 = new JWFramework.TestObject;
            this.sceneTestModel = [];
            this.sceneTestModel = [{
                    model: this.F16, url: 'Model/F-16D/F-16D.gltf'
                },
                {
                    model: this.helmet, url: 'Model/DamagedHelmet.gltf'
                }];
            this.modelNumber = this.sceneTestModel.length;
        }
        ModelSceneTest.getInstance = function () {
            if (!ModelSceneTest.instance) {
                ModelSceneTest.instance = new ModelSceneTest;
            }
            return ModelSceneTest.instance;
        };
        Object.defineProperty(ModelSceneTest.prototype, "ModelSceneTest", {
            get: function () {
                return this.sceneTestModel;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ModelSceneTest.prototype, "ModelNumber", {
            get: function () {
                return this.modelNumber;
            },
            enumerable: false,
            configurable: true
        });
        return ModelSceneTest;
    }());
    JWFramework.ModelSceneTest = ModelSceneTest;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=define.js.map