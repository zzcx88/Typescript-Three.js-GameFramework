var JWFramework;
(function (JWFramework) {
    class EditScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super(sceneManager);
        }
        BuildObject() {
            JWFramework.ModelLoadManager.getInstance().LoadScene();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.light = new JWFramework.Light();
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 1.5;
            this.light.GameObjectInstance.position.set(10000, 10000, 0);
            this.SceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }
        BuildFog() {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 10, 1000);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                if (JWFramework.InputManager.getInstance().GetKeyState('1', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeModify();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('2', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeClone();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('3', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeTerrain();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('4', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeRemove();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('r', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.GUIManager.getInstance().GUI_Terrain.ChangeTerrainOption();
                }
                if (JWFramework.SceneManager.getInstance().CurrentScene.Picker.PickMode == JWFramework.PickMode.PICK_TERRAIN)
                    if (JWFramework.InputManager.getInstance().GetKeyState('t', JWFramework.KeyState.KEY_PRESS))
                        this.Picker.SetPickPosition(this.Picker.MouseEvent);
                if (JWFramework.InputManager.getInstance().GetKeyState('5', JWFramework.KeyState.KEY_DOWN)) {
                    fetch("./Model/Scene.json")
                        .then(response => {
                        return response.json();
                    })
                        .then(jsondata => console.log(jsondata[0]));
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('delete', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.ObjectManager.getInstance().DeleteAllObject();
                }
            }
        }
    }
    JWFramework.EditScene = EditScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=EditScene.js.map