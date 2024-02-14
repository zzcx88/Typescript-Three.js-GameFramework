/// <reference path="../GameObject.ts" />
/// <reference path="../../Manager/GUIManager.ts" />
namespace JWFramework
{
    export class EditObject extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;

            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);
            this.collisionComponent = new CollisionComponent(this);
            this.guiComponent = new GUIComponent(this);
        }

        public InitializeAfterLoad()
        {
            this.GameObjectInstance.matrixAutoUpdate = true;
            let guiSrt = GUIManager.getInstance().GUI_SRT;
            
            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
            {
                if (guiSrt.DefaultEditableBounding == true)
                {
                    this.PhysicsComponent.SetScaleScalar(1);
                    this.PhysicsComponent.SetRotateVec3(guiSrt.DefaultRotate);
                    this.PhysicsComponent.SetScale(guiSrt.DefaultScale.x, guiSrt.DefaultScale.y, guiSrt.DefaultScale.z);
                    this.CollisionComponent.IsEditable = guiSrt.DefaultEditableBounding;
                    this.CollisionComponent.CreateOrientedBoundingBox(this.PhysicsComponent.GetPosition(), guiSrt.DefaultBounding.clone());
                    this.collisionComponent.IsEditable = true;
                    this.CollisionComponent.CreateRaycaster();
                }
                else
                {
                    this.PhysicsComponent.SetScaleScalar(1);
                    this.CreateCollider();
                }
                if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
                    this.axisHelper = new THREE.AxesHelper(10);
                    (this.axisHelper.material as THREE.Material).fog = false;
                    (this.axisHelper.material as THREE.Material).depthTest = false;
                    this.GameObjectInstance.add(this.axisHelper);
                    this.guiComponent.GetLabel();
                }
            }
        }

        public CreateCollider()
        {
            //this.CollisionComponent.CreateBoundingBox(this.PhysicsComponent.GetScale().x, this.PhysicsComponent.GetScale().y, this.PhysicsComponent.GetScale().z);
            //let size = new THREE.Vector3().subVectors(this.PhysicsComponent.GetMaxVertex(), this.PhysicsComponent.GetMinVertex());
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition());
            this.collisionComponent.IsEditable = false;
            this.CollisionComponent.CreateRaycaster();
            //SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
        }

        public CollisionActive()
        {
            //console.clear();
            //console.log("충돌");
        }

        public CollisionDeActive()
        {
        }

        private launchMissile()
        {
            if (this.canLaunch)
            {
                let objectManager = ObjectManager.getInstance();
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("R-60M"));
                cloneObject.PhysicsComponent.SetScale(1, 1, 1);
                cloneObject.GameObjectInstance.setRotationFromEuler(this.PhysicsComponent.GetRotateEuler());
                cloneObject.PhysicsComponent.SetPostionVec3(new THREE.Vector3(this.GameObjectInstance.position.x, this.GameObjectInstance.position.y, this.GameObjectInstance.position.z));
                cloneObject.PhysicsComponent.GetPosition().add(this.physicsComponent.Up.multiplyScalar(-3));
                (cloneObject as R60M).AirCraftSpeed = this.throttle;
                objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
            }
        }

        public Animate()
        {
            this.LabelOnOff();
            this.TargetTest();
            
            if (this.Picked == true)
            {
                this.IsRayOn = true;
                this.PhysicsComponent.MoveFoward(this.throttle);
                this.SpeedIndicaterProcess();
                this.InputProcess();
                this.SeekerProcess();
            }
            else
            {
                this.IsRayOn = false;
                this.throttle = 0;
            }

            this.EditHelperProcess();

            if (this.isClone == true)
                this.CollisionComponent.Update();

            if (this.AnimationMixer != null)
                this.AnimationMixer.update(WorldManager.getInstance().GetDeltaTime());

            this.prevPosition = this.PhysicsComponent.GetPosition().clone();
        }

        private SpeedIndicaterProcess()
        {
            let moveDistance = this.physicsComponent.GetPosition().clone().sub(this.prevPosition).length();
            document.getElementById("speed").innerText = "속도 : " + UnitConvertManager.getInstance().ConvertToSpeedForKmh(moveDistance);
        }

        private SeekerProcess()
        {
            let targetObject = ObjectManager.getInstance().GetObjectFromName("Target") as EditObject;
            if (targetObject != null)
            {
                let targetPos = targetObject.physicsComponent.GetPosition().clone();
                let playerPos = this.physicsComponent.GetPosition().clone();
                let lookVec = this.physicsComponent.Look.clone().normalize();
                let targetVec = targetPos.clone().sub(playerPos).normalize();
                let angleRad = Math.acos(lookVec.dot(targetVec));
                let angleDeg = THREE.MathUtils.radToDeg(angleRad);
                if (angleDeg <= 10)
                {
                    this.canLaunch = true;
                }
                else
                    this.canLaunch = false;
            }
        }

        private TargetTest()
        {
            if (this.isTarget == true)
            {
                this.throttle = 50;
                this.PhysicsComponent.MoveFoward(this.throttle);
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Up, 0.5);
            }
        }

        private LabelOnOff()
        {
            let cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
            if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
                WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
            if (this.GUIComponent.GetLabel().GameObjectInstance != null)
            {
                if (cameraPosition.sub(this.physicsComponent.GetPosition()).length() > 3000)
                {
                    this.GUIComponent.GetLabel().GameObjectInstance.visible = false;
                    this.GameObjectInstance.visible = false;
                }
                else
                {
                    this.GUIComponent.GetLabel().GameObjectInstance.visible = true;
                    this.GameObjectInstance.visible = true;
                }
            }
        }

        private InputProcess()
        {
            let inputManager = InputManager.getInstance();
            if ((SceneManager.getInstance().CurrentScene as EditScene).GizmoOnOff == false)
            {
                if (inputManager.GetKeyState('left', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (inputManager.GetKeyState('right', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (inputManager.GetKeyState('down', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (inputManager.GetKeyState('up', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (inputManager.GetKeyState('w', KeyState.KEY_PRESS))
                {
                    if (this.throttle < 100)
                        this.throttle += 20 * WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 100;
                }
                if (inputManager.GetKeyState('s', KeyState.KEY_PRESS))
                {
                    if (this.throttle > 0)
                        this.throttle -= 20 * WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 0;
                }
                if (inputManager.GetKeyState('f', KeyState.KEY_PRESS))
                {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
                }
                if (inputManager.GetKeyState('r', KeyState.KEY_PRESS))
                {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
                }
            }
            if (inputManager.GetKeyState('p', KeyState.KEY_DOWN))
            {
                this.isTarget = true;
                this.name = "Target";
            }
            if (inputManager.GetKeyState('space', KeyState.KEY_DOWN))
            {
                this.launchMissile();
            }
        }

        private EditHelperProcess()
        {
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == true)
            {
                (SceneManager.getInstance().CurrentScene as EditScene).AttachGizmo(this);

                this.axisHelper.visible = true;
                let cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
                if (this.GUIComponent.GetLabel().GameObjectInstance != null)
                {
                    let size = cameraPosition.sub(this.physicsComponent.GetPosition()).length() / 100;
                    if (size <= 3)
                        size = 3;
                    this.axisHelper.scale.set(size, size, size);
                }
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == false)
            {
                (SceneManager.getInstance().CurrentScene as EditScene).DetachGizmo(this);
                this.axisHelper.visible = false;
            }
        }

        private isTarget: boolean = false;
        public throttle: number = 0;
        private canLaunch: boolean = false;
        private prevPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        private axisHelper: THREE.AxesHelper;

        //private fixedSeeker: SeekerCircle;

        //private raderFrustum: THREE.Frustum = new THREE.Frustum();
    }
}