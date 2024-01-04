/// <reference path="SceneBase.ts" />
/// <reference path="../Manager/ModelLoadManager.ts" />
/// <reference path="../Object/Light/Light.ts" />
/// <reference path="../ObjectPool/ObjectPool.ts" />

namespace JWFramework
{
    export class EditScene extends SceneBase
    {
        constructor(sceneManager: SceneManager)
        {
            super(sceneManager);
        }

        BuildSkyBox()
        {
            this.SceneManager.SceneInstance.background = new THREE.CubeTextureLoader()
                .setPath('Model/SkyBox/')
                .load([
                    'Right.bmp',
                    'Left.bmp',
                    'Up.bmp',
                    'Down.bmp',
                    'Front.bmp',
                    'Back.bmp'
                ]);
            this.SceneManager.SceneInstance.environment = this.SceneManager.SceneInstance.background;
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
            this.directionalLight = new Light(LightType.LIGHT_DIRECTIONAL);
            ObjectManager.getInstance().AddObject(this.directionalLight, "directionalLight", this.directionalLight.Type);
            this.directionalLight.SetColor(0xFFFFFF);
            this.directionalLight.Intensity = 1.0;
            this.directionalLight.PhysicsComponent.SetPostionVec3(new THREE.Vector3(1, 1, 0));
            
            //AmbientLight
            this.ambientLight = new Light(LightType.LIGHT_AMBIENT);
            ObjectManager.getInstance().AddObject(this.ambientLight, "ambientlLight", this.ambientLight.Type);
            this.ambientLight.SetColor(0xFFFFFF);
            this.ambientLight.Intensity = 1.0;
            
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
                this.MakeSceneCloud();
                ObjectManager.getInstance().Animate();
                this.InputProcess();
                this.ReloadProcess();
            }
        }

        private MakeSceneCloud()
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
        }

        private InputProcess()
        {
            if (InputManager.getInstance().GetKeyState('1', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeModify();
            }
            if (InputManager.getInstance().GetKeyState('2', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeClone();
            }
            if (InputManager.getInstance().GetKeyState('3', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeTerrain();
            }
            if (InputManager.getInstance().GetKeyState('4', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeRemove();
            }
            if (InputManager.getInstance().GetKeyState('6', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeDummyTerrain();
            }
            if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_DOWN))
            {
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

        private ReloadProcess()
        {
            if (this.reloadScene)
            {
                if (ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length == 0)
                {
                    ModelLoadManager.getInstance().LoadHeightmapTerrain();
                    ModelLoadManager.getInstance().LoadSavedScene();
                    WorldManager.getInstance().Renderer.clear();
                    this.BuildLight();
                    this.makedCloud = false;
                    this.reloadScene = false;
                }
            }
        }
        
        private directionalLight: Light;
        private ambientLight: Light;
        private makedCloud: boolean = false;
    }
}
