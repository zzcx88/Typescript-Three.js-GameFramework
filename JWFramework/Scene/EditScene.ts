/// <reference path="SceneBase.ts" />
/// <reference path="../Manager/ModelLoadManager.ts" />
/// <reference path="../Object/Light/Light.ts" />
namespace JWFramework
{
    export class EditScene extends SceneBase
    {
        constructor(sceneManager: SceneManager)
        {
            super(sceneManager);
        }

        BuildObject()
        {
            ModelLoadManager.getInstance().LoadScene();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }

        BuildLight()
        {
            ////Directional Light
            this.light = new Light(LightType.LIGHT_DIRECTIONAL);
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 0.8;
            this.light.GameObjectInstance.position.set(1, 1, 0);
            //this.light.GameObjectInstance.rotation.set(30, 0, 0);
            this.SceneManager.SceneInstance.add(this.light.GameObjectInstance);

            //Sub Directional Light
            this.light2 = new Light(LightType.LIGHT_DIRECTIONAL);
            this.light2.SetColor(0xFFFFFF);
            this.light2.Intensity = 0.5;
            this.light2.GameObjectInstance.position.set(-1, 1, 1);
            this.SceneManager.SceneInstance.add(this.light2.GameObjectInstance);

            //AmbientLight
            this.light3 = new Light(LightType.LIGHT_AMBIENT);
            this.light3.SetColor(0xFFFFFF);
            this.light3.Intensity = 1.0;
            this.SceneManager.SceneInstance.add(this.light3.GameObjectInstance);
        }
        BuildFog()
        {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 300, 2900);
        }

        public Animate()
        {
            if (ModelLoadManager.getInstance().LoadComplete == true)
            {
                if (this.makedCloud == false)
                {
                    for (let i = 0; i < 30; ++i)
                    {
                        let lowCloud = new LowCloud();
                        lowCloud.IsClone = true;
                        let x = -5000 + Math.random() * 20000;
                        let y = 200 + Math.random() * 200;
                        let z = -5000 + Math.random() * 20000;
                        lowCloud.BuildClouds(x, y, z);
                    }
                    this.makedCloud = true;

                }
                ObjectManager.getInstance().Animate();
                //this.SceneManager.SceneInstance.fog.color.lerpColors(this.SceneManager.SceneInstance.fog.color, new THREE.Color(0xb7dcfd), 1)
                
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
                if (InputManager.getInstance().GetKeyState('6', KeyState.KEY_DOWN))
                {
                    this.Picker.ChangePickModeDummyTerrain();
                }
                if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_DOWN)) {
                    GUIManager.getInstance().GUI_Terrain.ChangeTerrainOption();
                }
                if (SceneManager.getInstance().CurrentScene.Picker.PickMode == PickMode.PICK_TERRAIN ||
                    SceneManager.getInstance().CurrentScene.Picker.PickMode == PickMode.PICK_DUMMYTERRAIN)
                    if (InputManager.getInstance().GetKeyState('t', KeyState.KEY_PRESS))
                        this.Picker.SetPickPosition(this.Picker.MouseEvent);

                if (InputManager.getInstance().GetKeyState('u', KeyState.KEY_PRESS))
                {
                    SceneManager.getInstance().CurrentScene.NeedOnTerrain = true;
                    GUIManager.getInstance().GUI_Terrain.ChangeHeightOffset();
                }
                else
                    SceneManager.getInstance().CurrentScene.NeedOnTerrain = false;
                    
                if (InputManager.getInstance().GetKeyState('delete', KeyState.KEY_PRESS))
                {
                    ObjectManager.getInstance().DeleteAllObject();
                    this.reloadScene = true;
                }
                if (InputManager.getInstance().GetKeyState('p', KeyState.KEY_PRESS))
                {
                    console.log(WorldManager.getInstance().Renderer.info);
                }
            }
            if (this.reloadScene)
                if (ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length == 0)
                {
                    ModelLoadManager.getInstance().LoadHeightmapTerrain();
                    ModelLoadManager.getInstance().LoadSavedScene();
                    WorldManager.getInstance().Renderer.clear();
                    this.makedCloud = false;
                    this.reloadScene = false;
                }
        }
        
        private light: Light;
        private light2: Light;
        private light3: Light;
        private makedCloud: boolean = false;
    }
}
