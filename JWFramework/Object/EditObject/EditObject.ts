/// <reference path="../GameObject.ts" />
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
        }

        public InitializeAfterLoad()
        {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            //this.PhysicsComponent.SetPostion(0, 0, 0);
            //this.GameObjectInstance.rotation.x = 0;
            //this.GameObjectInstance.rotation.y = 0;
            //this.GameObjectInstance.rotation.z = 0;

            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
            {
                this.CreateCollider();
                if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
                    this.axisHelper = new THREE.AxesHelper(10);
                    this.GameObjectInstance.add(this.axisHelper);
                    //this.GameObjectInstance.add(this.CollisionComponent.BoxHelper);
                }
                //this.AnimationMixer.clipAction(this.ModelData.animations[0]).play();
            }
        }

        public CreateCollider()
        {
            //this.CollisionComponent.CreateBoundingBox(this.PhysicsComponent.GetScale().x, this.PhysicsComponent.GetScale().y, this.PhysicsComponent.GetScale().z);
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(2,1,2));
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
            let objectManager = ObjectManager.getInstance();
            let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("R-60M"));
            cloneObject.PhysicsComponent.SetScale(1, 1, 1);
            //cloneObject.PhysicsComponent.SetRotateVec3(new THREE.Vector3(this.GameObjectInstance.rotation.x, this.GameObjectInstance.rotation.y, this.GameObjectInstance.rotation.z));
            cloneObject.GameObjectInstance.setRotationFromEuler(this.PhysicsComponent.GetRotateEuler());
            cloneObject.PhysicsComponent.SetPostionVec3(new THREE.Vector3(this.GameObjectInstance.position.x, this.GameObjectInstance.position.y, this.GameObjectInstance.position.z));
            cloneObject.PhysicsComponent.GetPosition().add(this.physicsComponent.Up.multiplyScalar(-3));
            (cloneObject as R60M).AirCraftSpeed = this.throttle;
            objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
        }

        public Animate()
        {
            if (this.isTarget == true)
            {
                this.throttle = 50;
                this.PhysicsComponent.MoveFoward(this.throttle);
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Up, 0.5);
                //this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 0.5);
            }
            if (this.Picked == true)
            {
                this.IsRayOn = true;
                this.PhysicsComponent.MoveFoward(this.throttle);
                if (InputManager.getInstance().GetKeyState('left', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (InputManager.getInstance().GetKeyState('right', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (InputManager.getInstance().GetKeyState('down', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (InputManager.getInstance().GetKeyState('up', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (InputManager.getInstance().GetKeyState('w', KeyState.KEY_PRESS))
                {
                    if (this.throttle < 100)
                        this.throttle += 20 * WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 100;
                }
                if (InputManager.getInstance().GetKeyState('s', KeyState.KEY_PRESS))
                {
                    if (this.throttle > 0)
                        this.throttle -= 20 * WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 0;
                }
                if (InputManager.getInstance().GetKeyState('f', KeyState.KEY_PRESS))
                {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
                }
                if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_PRESS))
                {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
                }
                if (InputManager.getInstance().GetKeyState('p', KeyState.KEY_DOWN))
                {
                    this.isTarget = true;
                    this.name = "Target";
                }
                if (InputManager.getInstance().GetKeyState('space', KeyState.KEY_DOWN))
                {
                    this.launchMissile();
                }
                let moveDistance = this.physicsComponent.GetPosition().clone().sub(this.prevPosition).length();
                document.getElementById("speed").innerText = "속도 : " + UnitConvertManager.getInstance().ConvertToSpeedForKmh(moveDistance);

                let targetObject = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject);
                if (targetObject != null)
                    console.log(UnitConvertManager.getInstance().ConvertToDistance(this.physicsComponent.GetPosition().clone().sub(targetObject.physicsComponent.GetPosition().clone()).length()));
            }
            else
                this.IsRayOn = false;

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == true)
            {
                this.axisHelper.visible = true;
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == false)
            {
                this.axisHelper.visible = false;
            }
            if (this.isClone == true)
            {
                this.CollisionComponent.Update();
            }
            if (this.AnimationMixer != null)
            {
                this.AnimationMixer.update(WorldManager.getInstance().GetDeltaTime());
            }
            this.prevPosition = this.PhysicsComponent.GetPosition().clone();
        }

        private isTarget: boolean = false;
        public throttle: number = 0;
        private prevPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        private axisHelper: THREE.AxesHelper;
        //private raderFrustum: THREE.Frustum = new THREE.Frustum();
    }
}