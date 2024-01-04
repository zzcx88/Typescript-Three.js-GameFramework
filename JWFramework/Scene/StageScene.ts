namespace JWFramework
{
    export class StageScene extends SceneBase
    {
        constructor(sceneManager: SceneManager)
        {
            super(sceneManager);
        }

        BuildSkyBox()
        {
            
        }

        BuildObject()
        {
            ModelLoadManager.getInstance().LoadScene();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }

        BuildLight()
        {
            this.light = new Light(LightType.LIGHT_DIRECTIONAL);
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 1.5;
            this.light.GameObjectInstance.position.set(10000, 10000, 0);

            this.light2 = new Light(LightType.LIGHT_DIRECTIONAL);
            this.light2.SetColor(0xFFFFFF);
            this.light2.Intensity = 0.7;
            this.light2.GameObjectInstance.position.set(-10000, -10000, 0);

            this.SceneManager.SceneInstance.add(this.light.GameObjectInstance);
            //this.sceneManager.SceneInstance.add(this.light2.GameObjectInstance);
        }
        BuildFog()
        {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 10, 1000);
        }

        public Animate()
        {
            if (ModelLoadManager.getInstance().LoadComplete == true) {
                ObjectManager.getInstance().Animate();

                if (InputManager.getInstance().GetKeyState('1', KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeModify();
                }
                if (InputManager.getInstance().GetKeyState('2', KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeClone();
                }
                if (InputManager.getInstance().GetKeyState('3', KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeTerrain();
                }
                if (InputManager.getInstance().GetKeyState('4', KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeRemove();
                }
                if (InputManager.getInstance().GetKeyState('5', KeyState.KEY_DOWN)) {
                    fetch("./Model/Scene.json")
                        .then(response =>
                        {
                            return response.json();
                        })
                        .then(jsondata => console.log(jsondata[0]));
                    this.BuildObject();
                }
                if (InputManager.getInstance().GetKeyState('delete', KeyState.KEY_DOWN)) {
                    ObjectManager.getInstance().DeleteAllObject();
                }
            }
        }
        private light: Light;
        private light2: Light;
        private terrain = [];
    }
}
