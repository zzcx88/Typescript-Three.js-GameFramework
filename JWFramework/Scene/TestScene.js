var JWFramework;
(function (JWFramework) {
    class TestScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new JWFramework.Light();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }
        BuildObject() {
            JWFramework.ModelLoadManager.getInstance().LoadSceneTest();
            this.terrain = new JWFramework.HeightmapTerrain();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(0, 30, 0);
            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                //CameraManager.getInstance().SetCameraSavedPosition();
                //this.Picker.OrbitControl.enabled = false;
                if (JWFramework.InputManager.getInstance().GetKeyState('1')) {
                    this.Picker.ChangePickModeModify();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('2')) {
                    this.Picker.ChangePickModeClone();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('3')) {
                    this.Picker.ChangePickModeTerrain();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('4')) {
                    this.Picker.ChangePickModeRemove();
                }
            }
        }
    }
    JWFramework.TestScene = TestScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestScene.js.map