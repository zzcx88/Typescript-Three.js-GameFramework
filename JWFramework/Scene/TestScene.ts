namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.BuildObject();
            this.BuildLight();
            this.BuildFog();
            this.SetPicker();
        }

        private BuildObject() {
            ModelLoadManager.getInstance().LoadSceneTest();
            this.terrain = new HeightmapTerrain();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }

        private BuildLight() {
            this.light = new Light();
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 1.5;
            this.light.GameObjectInstance.position.set(10000, 10000, 0);

            this.light2 = new Light();
            this.light2.SetColor(0xFFFFFF);
            this.light2.Intensity = 0.7;
            this.light2.GameObjectInstance.position.set(-10000, -10000, 0);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
            this.sceneManager.SceneInstance.add(this.light2.GameObjectInstance);
        }
        private BuildFog() {
            let sceneInstance = this.sceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 10, 1000);
        }

        public Animate() {
            if (ModelLoadManager.getInstance().LoadComplete == true) {
                ObjectManager.getInstance().Animate();

                if (InputManager.getInstance().GetKeyState('1')) {
                    this.Picker.ChangePickModeModify();
                }
                if (InputManager.getInstance().GetKeyState('2')) {
                    this.Picker.ChangePickModeClone();
                }
                if (InputManager.getInstance().GetKeyState('3')) {
                    this.Picker.ChangePickModeTerrain();
                }
                if (InputManager.getInstance().GetKeyState('4')) {
                    this.Picker.ChangePickModeRemove();
                }
            }
        }
        private sceneManager: SceneManager
        private light: Light;
        private light2: Light;
        private terrain;
    }
}
