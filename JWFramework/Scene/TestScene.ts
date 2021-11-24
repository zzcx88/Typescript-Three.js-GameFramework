namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new Light();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }

        private BuildObject() {
            ModelLoadManager.getInstance().LoadSceneTest();
            this.terrain = new HeightmapTerrain();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }

        private BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(0,  30, 0);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }

        public Animate() {
            if (ModelLoadManager.getInstance().LoadComplete == true) {
                ObjectManager.getInstance().Animate();

                //CameraManager.getInstance().SetCameraSavedPosition();

                if (InputManager.getInstance().GetKeyState('1')) {
                    this.Picker.ChangePickModeModify();
                }
                if (InputManager.getInstance().GetKeyState('2')) {
                    this.Picker.ChangePickModeClone();
                }
                if (InputManager.getInstance().GetKeyState('3')) {
                    this.Picker.ChangePickModeTerrain();
                }
            }
        }
        private sceneManager: SceneManager
        private light: Light;
        private terrain;
    }
}
