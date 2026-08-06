import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { CameraManager } from '../Manager/CameraManager';
import { CameraMode, KeyState, LightType, ObjectType, PickMode } from '../enum';
import { GUIManager } from '../Manager/GUIManager';
import { GUI_Color } from '../GUI/GUIControls/GUI_Color';
import type { GameObject } from '../Object/GameObject';
import { InputManager } from '../Manager/InputManager';
import { Light } from '../Object/Light/Light';
import { LowCloud } from '../Object/InGameObject/LowCloud';
import { MissileFog } from '../Object/InGameObject/MissileFog';
import { ModelLoadManager } from '../Manager/ModelLoadManager';
import { ObjectManager } from '../Manager/ObjectManager';
import { ObjectPool } from '../ObjectPool/ObjectPool';
import { SceneBase } from './SceneBase';
import { SceneManager } from '../Manager/SceneManager';
import { WorldManager } from '../Manager/WorldManager';


export class EditScene extends SceneBase
{
    constructor(sceneManager: SceneManager)
    {
        super(sceneManager);
    }

    BuildSkyBox()
    {
        const skyBox = new THREE.CubeTextureLoader()
            .setPath('Model/SkyBox/')
            .load([
                'Right.bmp',
                'Left.bmp',
                'Up.bmp',
                'Down.bmp',
                'Front.bmp',
                'Back.bmp'
            ]);
        // 스카이박스 이미지의 바이트는 sRGB 값이다. 태그가 없으면 three 가 선형으로 오인해
        // 디코딩을 건너뛰고, 출력에서 sRGB 인코딩만 한 번 더 걸려 허옇게 뜬다.
        skyBox.colorSpace = THREE.SRGBColorSpace;
        this.SceneManager.SceneInstance.background = skyBox;
        this.SceneManager.SceneInstance.environment = skyBox;
    }

    BuildObject()
    {
        ModelLoadManager.getInstance().LoadScene();
        const rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
        WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);

        this.missileFogPool = new ObjectPool(MissileFog);
        for (let i = 0; i < 500; ++i) {
            const missileFog = new MissileFog();
            missileFog.IsClone = true;
            this.missileFogPool.AddObject(missileFog);
        }
    }

    BuildLight()
    {
        // r165 이전에는 WebGLLights 가 조명 intensity 에 π 를 곱했다(레거시 모드).
        // 그 보정이 사라졌으므로 소스에서 되돌려 같은 조도에서 다시 시작했다.
        // 출발점은 0.6 * π = 1.885 · 0.5 * π = 1.571 이었고,
        // 아래 값은 거기서 GUI_Color 로 눈으로 맞춰 확정한 것이다.

        ////Directional Light
        this.directionalLight = new Light(LightType.LIGHT_DIRECTIONAL);
        ObjectManager.getInstance().AddObject(this.directionalLight, "directionalLight", this.directionalLight.Type);
        this.directionalLight.SetColor(0xFFFFFF);
        this.directionalLight.Intensity = 1;
        this.directionalLight.PhysicsComponent.SetPositionVec3(new THREE.Vector3(1, 1, 0));

        //AmbientLight
        this.ambientLight = new Light(LightType.LIGHT_AMBIENT);
        ObjectManager.getInstance().AddObject(this.ambientLight, "ambientLight", this.ambientLight.Type);
        this.ambientLight.SetColor(0xFFFFFF);
        this.ambientLight.Intensity = 1.5;

        // 색 조정 임시 패널. 씬 재로드 때 BuildLight() 가 다시 불리므로 한 번만 만든다.
        // GUIManager 를 거치지 않는 것은 의도다 — 나중에 이 블록만 지우면 통째로 빠진다.
        if (this.colorPanel == null)
        {
            const worldManager = WorldManager.getInstance();
            this.colorPanel = new GUI_Color(worldManager.Renderer, worldManager.Canvas.width / 8);
        }
        this.colorPanel.BindLight(this.directionalLight, this.ambientLight);
    }

    BuildFog()
    {
        const sceneInstance = this.SceneManager.SceneInstance;
        const color = 0xdefdff;
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

        const button = document.createElement("button");
        button.innerHTML = "LoadScene";
        button.addEventListener("click", function ()
        {
            ObjectManager.getInstance().DeleteAllObject();
            (SceneManager.getInstance().CurrentScene as EditScene).reloadScene = true;
        });
        // 버튼을 문서에 추가
        document.getElementById("info").appendChild(button);

        const button1 = document.createElement("button");
        button1.innerHTML = "3rdView";
        button1.addEventListener("click", function ()
        {
            const sceneManager = (SceneManager.getInstance().CurrentScene as EditScene);
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

        const button2 = document.createElement("button");
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
            const worldManager = WorldManager.getInstance();
            this.gizmo = new TransformControls(worldManager.MainCamera.CameraInstance, worldManager.Renderer.domElement);
            this.gizmo.addEventListener('dragging-changed', function (event)
            {
                SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = !event.value;
                SceneManager.getInstance().CurrentScene.Picker.EnablePickOff = false;
            });
            // r169 부터 TransformControls 는 Object3D 가 아니다. 씬에는 헬퍼를 넣는다.
            this.sceneManager.SceneInstance.add(this.gizmo.getHelper());
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
        if (this.madeCloud == false)
        {
            for (let i = 0; i < 30; ++i)
            {
                const lowCloud = new LowCloud();
                lowCloud.IsClone = true;
                const x = -5000 + Math.random() * 20000;
                const y = 200 + Math.random() * 200;
                const z = -5000 + Math.random() * 20000;
                lowCloud.BuildClouds(x, y, z);
            }
            this.madeCloud = true;
        }
    }

    private InputProcess()
    {
        const inputManager = InputManager.getInstance();
        const sceneManager = SceneManager.getInstance();

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
            this.sceneManager.SceneInstance.remove(this.gizmo.getHelper());
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
                this.madeCloud = false;
                this.reloadScene = false;
            }
        }
    }

    public missileFogPool: ObjectPool<MissileFog>;
    private testLoad = false;
    private directionalLight: Light;
    private ambientLight: Light;
    // 임시 — dat.GUI 교체 시 제거.
    // 초기화식(= null)을 붙이면 안 된다. 파생 클래스 필드 초기화는 super() 뒤에 실행되는데
    // BuildLight() 는 SceneBase 생성자 안에서 이미 불리므로, 만들어 둔 참조를 덮어써
    // 씬 재로드 때 패널이 하나 더 생긴다.
    private colorPanel: GUI_Color;
    private madeCloud: boolean = false;
    private gizmo: TransformControls;
    private gizmoOnOff: boolean = true;
}
