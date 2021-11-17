namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new Light();
            this.terrain = new HeightmapTerrain();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }

        private BuildObject() {
            this.terrain.InitializeAfterLoad();
            ModelLoadManager.getInstance().LoadSceneTest();
        }

        private BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(-1, 4, 4);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }

        public Animate() {
            if (ModelLoadManager.getInstance().LoadComplete == true) {
                ObjectManager.getInstance().Animate();
                if (InputManager.getInstance().GetKeyState('f')) {
                    this.terrain.GetHeight(ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().x,
                        ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().z);
                }
            }
        }

        private sceneManager: SceneManager
        private light: Light;

        private terrain: HeightmapTerrain;
    }
}
