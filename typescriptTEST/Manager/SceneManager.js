var JWFramework;
(function (JWFramework) {
    var SceneManager = /** @class */ (function () {
        function SceneManager() {
        }
        SceneManager.getInstance = function () {
            if (!SceneManager.instance) {
                SceneManager.instance = new SceneManager;
            }
            return SceneManager.instance;
        };
        Object.defineProperty(SceneManager.prototype, "SceneInstance", {
            get: function () {
                return this.sceneThree;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "CurrentScene", {
            get: function () {
                return this.scene;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SceneManager.prototype, "SceneType", {
            get: function () {
                return this.sceneType;
            },
            enumerable: false,
            configurable: true
        });
        SceneManager.prototype.BuildScene = function () {
            this.sceneThree = new THREE.Scene();
            this.sceneType = JWFramework.SceneType.SCENE_TEST;
            this.objectManager = JWFramework.ObjectManager.getInstance();
            switch (this.sceneType) {
                case JWFramework.SceneType.SCENE_TEST:
                    this.scene = new JWFramework.TestScene(this);
                    break;
                case JWFramework.SceneType.SCENE_START:
                    break;
                case JWFramework.SceneType.SCENE_STAGE:
                    break;
            }
        };
        SceneManager.prototype.Animate = function () {
            this.scene.Animate();
        };
        return SceneManager;
    }());
    JWFramework.SceneManager = SceneManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=SceneManager.js.map