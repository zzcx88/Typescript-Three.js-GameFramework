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

            this.missileFogPool = new ObjectPool(MissileFog);
            for (let i = 0; i < 500; ++i) {
                let missileFog = new MissileFog();
                missileFog.IsClone = true;
                this.missileFogPool.AddObject(missileFog);
            }
        }

        BuildLight()
        {
            ////Directional Light
            this.directionalLight = new Light(LightType.LIGHT_DIRECTIONAL);
            ObjectManager.getInstance().AddObject(this.directionalLight, "directionalLight", this.directionalLight.Type);
            this.directionalLight.SetColor(0xFFFFFF);
            this.directionalLight.Intensity = 0.6;
            this.directionalLight.PhysicsComponent.SetPostionVec3(new THREE.Vector3(1, 1, 0));
            
            //AmbientLight
            this.ambientLight = new Light(LightType.LIGHT_AMBIENT);
            ObjectManager.getInstance().AddObject(this.ambientLight, "ambientlLight", this.ambientLight.Type);
            this.ambientLight.SetColor(0xFFFFFF);
            this.ambientLight.Intensity = 0.5;
        }

        BuildFog()
        {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 300, 2900);
        }


        private TestMobileButtonCreate()
        {
            function toggleFullScreen()
            {
                if (!document.fullscreenElement)
                {
                    document.documentElement.requestFullscreen()
                } else
                {
                    if (document.exitFullscreen)
                    {
                        document.exitFullscreen()
                    }
                }
            }

            let button = document.createElement("button");
            button.innerHTML = "LoadScene";
            button.addEventListener("click", function ()
            {
                ObjectManager.getInstance().DeleteAllObject();
                (SceneManager.getInstance().CurrentScene as EditScene).reloadScene = true;
            });
            // 버튼을 문서에 추가
            document.getElementById("info").appendChild(button);

            let button1 = document.createElement("button");
            button1.innerHTML = "3rdView";
            button1.addEventListener("click", function ()
            {
                let sceneManager = (SceneManager.getInstance().CurrentScene as EditScene);
                if (sceneManager.Picker.GetPickParents() != null)
                {
                    if (CameraManager.getInstance().CameraMode == CameraMode.CAMERA_ORBIT)
                    {
                        CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
                    }
                    else
                        CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
                    sceneManager.gizmoOnOff = !sceneManager.gizmoOnOff;
                    if (sceneManager.gizmoOnOff == false && sceneManager.Picker.GetPickParents() != null)
                        sceneManager.DetachGizmo(sceneManager.Picker.GetPickParents());
                }
            });
            // 버튼을 문서에 추가
            document.getElementById("info").appendChild(button1);

            let button2 = document.createElement("button");
            button2.innerHTML = "FullScreen";
            button2.addEventListener("mousedown", function ()
            {
                toggleFullScreen();
            });
            // 버튼을 문서에 추가
            document.getElementById("info").appendChild(button2);
        }


        public Animate()
        {
            if (ModelLoadManager.getInstance().LoadComplete == true)
            {
                if (this.testLoad == false)
                {
                    this.TestMobileButtonCreate();
                    this.testLoad = true;
                }
                this.MakeGizmo();
                this.MakeSceneCloud();
                ObjectManager.getInstance().Animate();
                this.InputProcess();
                this.ReloadProcess();
            }
        }

        private MakeGizmo()
        {
            if (this.gizmo == null)
            {
                let worldManager = WorldManager.getInstance();
                this.gizmo = new THREE.TransformControls(worldManager.MainCamera.CameraInstance, worldManager.Renderer.domElement);
                this.gizmo.addEventListener('dragging-changed', function (event)
                {
                    SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = !event.value;
                    SceneManager.getInstance().CurrentScene.Picker.EnablePickOff = false;
                });
                this.sceneManager.SceneInstance.add(this.gizmo);
            }
        }

        public AttachGizmo(gameObject: GameObject)
        {
            if (this.gizmoOnOff)
                this.gizmo.attach(gameObject.GameObjectInstance);
        }

        public DetachGizmo(gameObject: GameObject)
        {
            if (this.gizmo.object == gameObject.GameObjectInstance)
                this.gizmo.detach();
        }

        public get GizmoOnOff()
        {
            return this.gizmoOnOff;
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
            let inputManager = InputManager.getInstance();
            let sceneManager = SceneManager.getInstance();

            if (inputManager.GetKeyState('1', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeModify();
            }
            if (inputManager.GetKeyState('2', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeClone();
            }
            if (sceneManager.CurrentScene.Picker.PickMode == PickMode.PICK_CLONE)
            {
                if (inputManager.GetKeyState('t', KeyState.KEY_PRESS))
                    this.Picker.SetPickPosition(this.Picker.MouseEvent);
            }
            if (inputManager.GetKeyState('3', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeTerrain();
            }
            if (inputManager.GetKeyState('4', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeRemove();
            }
            if (inputManager.GetKeyState('6', KeyState.KEY_DOWN))
            {
                this.Picker.ChangePickModeDummyTerrain();
            }
            if (inputManager.GetKeyState('q', KeyState.KEY_DOWN))
            {
                this.gizmoOnOff = !this.gizmoOnOff;
                if (this.gizmoOnOff == false && this.Picker.GetPickParents() != null)
                    this.DetachGizmo(this.Picker.GetPickParents());
            }
            if (inputManager.GetKeyState('w', KeyState.KEY_DOWN))
            {
                this.gizmo.setMode("translate");
            }
            if (inputManager.GetKeyState('e', KeyState.KEY_DOWN))
            {
                this.gizmo.setMode("rotate");
            }
            if (inputManager.GetKeyState('r', KeyState.KEY_DOWN))
            {
                this.gizmo.setMode("scale");
            }
            if (inputManager.GetKeyState('o', KeyState.KEY_DOWN))
            {
                GUIManager.getInstance().GUI_Terrain.ChangeTerrainOption();
            }
            if (sceneManager.CurrentScene.Picker.PickMode == PickMode.PICK_TERRAIN ||
                sceneManager.CurrentScene.Picker.PickMode == PickMode.PICK_DUMMYTERRAIN)
                if (inputManager.GetKeyState('t', KeyState.KEY_PRESS))
                    this.Picker.SetPickPosition(this.Picker.MouseEvent);

            if (inputManager.GetKeyState('u', KeyState.KEY_PRESS))
            {
                sceneManager.CurrentScene.NeedOnTerrain = true;
                GUIManager.getInstance().GUI_Terrain.ChangeHeightOffset();
            }
            else
                sceneManager.CurrentScene.NeedOnTerrain = false;

            if (inputManager.GetKeyState('delete', KeyState.KEY_DOWN))
            {
                ObjectManager.getInstance().DeleteAllObject();
                this.gizmo.detach();
                this.sceneManager.SceneInstance.remove(this.gizmo);
                this.reloadScene = true;
            }
            if (inputManager.GetKeyState('p', KeyState.KEY_DOWN))
            {
                console.log(WorldManager.getInstance().Renderer.info);

                let objects = 0, vertices = 0, triangles = 0;

                for (let i = 0, l = this.sceneManager.SceneInstance.children.length; i < l; i++)
                {

                    const object = this.sceneManager.SceneInstance.children[i];

                    object.traverseVisible(function (object)
                    {

                        objects++;

                        if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh)
                        {
                            const geometry = object.geometry;
                            vertices += geometry.attributes.position.count;
                            //if (geometry.index !== null)
                            //{
                            //    triangles += geometry.index.count / 3;
                            //} else
                            {
                                triangles += geometry.attributes.position.count / 3;
                            }
                        }
                    });
                }
                console.log("Total Triangles: " + triangles)
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
                    this.gizmo.dispose();
                    this.gizmo = null;
                    this.makedCloud = false;
                    this.reloadScene = false;
                }
            }
        }

        public missileFogPool: ObjectPool<MissileFog>;
        private testLoad = false;
        private directionalLight: Light;
        private ambientLight: Light;
        private makedCloud: boolean = false;
        private gizmo: THREE.TransformControls;
        private gizmoOnOff: boolean = true;
    }
}
