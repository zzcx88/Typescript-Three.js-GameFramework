var JWFramework;
(function (JWFramework) {
    class SceneManager {
        constructor() { }
        static getInstance() {
            if (!SceneManager.instance) {
                SceneManager.instance = new SceneManager;
            }
            return SceneManager.instance;
        }
        get SceneInstance() {
            return this.sceneThree;
        }
        get CurrentScene() {
            return this.scene;
        }
        get SceneType() {
            return this.sceneType;
        }
        BuildScene() {
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
        }
        Animate() {
            this.scene.Animate();
        }
    }
    JWFramework.SceneManager = SceneManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=SceneManager.js.map