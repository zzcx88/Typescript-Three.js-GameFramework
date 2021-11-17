var JWFramework;
(function (JWFramework) {
    class TestScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new JWFramework.Light();
            this.terrain = new JWFramework.HeightmapTerrain();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }
        BuildObject() {
            this.terrain.InitializeAfterLoad();
            JWFramework.ModelLoadManager.getInstance().LoadSceneTest();
        }
        BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(-1, 4, 4);
            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                if (JWFramework.InputManager.getInstance().GetKeyState('f')) {
                    this.terrain.GetHeight(JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().x, JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().z);
                }
            }
        }
    }
    JWFramework.TestScene = TestScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestScene.js.map