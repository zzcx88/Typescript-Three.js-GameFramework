namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.testCube = new TestCube();
            this.light = new Light();

            this.BuildObject();
            this.BuildLight();
        }

        private BuildObject() {
            ObjectManager.getInstance().AddObject(this.testCube, "testCube", this.testCube.Type);
        }

        private BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(-1, 4, 4);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }

        public Animate() {
            ObjectManager.getInstance().Animate();
        }

        private sceneManager: SceneManager
        private testCube: TestCube;
        private testCube2: TestCube;
        private light: Light;
    }
}
