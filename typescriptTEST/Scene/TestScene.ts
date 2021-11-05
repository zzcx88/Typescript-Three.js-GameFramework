namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            //this.testCube = new TestCube();
            this.light = new Light();
            this.BuildObject();
            this.BuildLight();
        }

        private BuildObject() {
            ModelLoadManager.getInstance().LoadSceneTest();
        }

        private BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(-1, 4, 4);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }

        public Animate() {
            if (ModelLoadManager.getInstance().LoadComplete == true)
            ObjectManager.getInstance().Animate();
        }

        private sceneManager: SceneManager
        private light: Light;
    }
}
