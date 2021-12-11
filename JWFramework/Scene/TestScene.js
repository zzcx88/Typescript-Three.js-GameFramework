var JWFramework;
(function (JWFramework) {
    class TestScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super();
            this.terrain = [];
            this.sceneManager = sceneManager;
            this.BuildObject();
            this.BuildLight();
            this.BuildFog();
            this.SetPicker();
        }
        BuildObject() {
            JWFramework.ModelLoadManager.getInstance().LoadSceneTest();
            for (let i = 0; i < 10; ++i) {
                for (let j = 0; j < 10; ++j) {
                    this.terrain[i] = new JWFramework.HeightmapTerrain(j * 300, i * 300, 32, 32);
                }
            }
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.light = new JWFramework.Light();
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 1.5;
            this.light.GameObjectInstance.position.set(10000, 10000, 0);
            this.light2 = new JWFramework.Light();
            this.light2.SetColor(0xFFFFFF);
            this.light2.Intensity = 0.7;
            this.light2.GameObjectInstance.position.set(-10000, -10000, 0);
            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
            //this.sceneManager.SceneInstance.add(this.light2.GameObjectInstance);
        }
        BuildFog() {
            let sceneInstance = this.sceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 10, 1000);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
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
                if (JWFramework.InputManager.getInstance().GetKeyState('5')) {
                    fetch("./Model/Scene.json")
                        .then(response => {
                        return response.json();
                    })
                        .then(jsondata => console.log(jsondata));
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('delete')) {
                    JWFramework.ObjectManager.getInstance().DeleteAllObject();
                }
            }
        }
    }
    JWFramework.TestScene = TestScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestScene.js.map