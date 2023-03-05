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
            else {
                this.CreateCollider();
                //this.AnimationMixer.clipAction(this.ModelData.animations[0]).play();
            }

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                //this.GameObjectInstance.add(this.CollisionComponent.BoxHelper);
            }
        }

        public CreateCollider()
        {
            //this.CollisionComponent.CreateBoundingBox(this.PhysicsComponent.GetScale().x, this.PhysicsComponent.GetScale().y, this.PhysicsComponent.GetScale().z);
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), this.physicsComponent.GetScale());
            this.CollisionComponent.CreateRaycaster();
            //SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
        }

        public CollisionActive()
        {
            //console.clear();
            //console.log("충돌");
            if (this.name != "Target" && this.Picked == true)
            {
                this.physicsComponent.SetPostion(40.1, 500.12, 73.02);
                this.GameObjectInstance.lookAt((ObjectManager.getInstance().GetObjectFromName("Target") as EditObject).physicsComponent.GetPosition());
            }
        }

        public CollisionDeActive()
        {
        }

        public Animate()
        {
            if (this.previousPosition == null)
                this.previousPosition = this.physicsComponent.GetPosition().clone();
            if (this.isTarget == true)
            {
                this.PhysicsComponent.MoveFoward(100);
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Up, 0.25);
            }
            if (this.Picked == true)
            {
                this.IsRayOn = true;
                if (InputManager.getInstance().GetKeyState('left', KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (InputManager.getInstance().GetKeyState('right', KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (InputManager.getInstance().GetKeyState('down', KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (InputManager.getInstance().GetKeyState('up', KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (InputManager.getInstance().GetKeyState('w', KeyState.KEY_PRESS))
                {
                    this.PhysicsComponent.MoveFoward(80);
                }
                if (InputManager.getInstance().GetKeyState('f', KeyState.KEY_PRESS)) {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
                }
                if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_PRESS)) {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
                }
                if (InputManager.getInstance().GetKeyState('p', KeyState.KEY_DOWN))
                {
                    this.isTarget = true;
                    this.name = "Target";
                }
                if (InputManager.getInstance().GetKeyState('space', KeyState.KEY_PRESS))
                {

                    let targetObject = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject);
                    const targetDirection = new THREE.Vector3().subVectors(targetObject.PhysicsComponent.GetPosition().clone(), this.PhysicsComponent.GetPosition().clone()).normalize(); // 목표 방향
                    const currentDirection = new THREE.Vector3(0,0,1).applyEuler(this.PhysicsComponent.GetRotateEuler()); // 현재 방향

                    const angle = currentDirection.angleTo(targetDirection); // 현재 방향과 목표 방향 사이의 각도
                    const axis = new THREE.Vector3().crossVectors(currentDirection, targetDirection).normalize(); // 회전 축

                    let maxSpeed = 500;
                    let maxRadius = 500;

                    let speed = maxSpeed * (angle / maxRadius); // 회전 속도
                    speed = Math.min(speed, maxSpeed); // 최대 속도 제한


                    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, speed); // 회전 quaternion

                    const currentRotation = new THREE.Quaternion();
                    currentRotation.setFromEuler(this.PhysicsComponent.GetRotateEuler());
                    const nextRotation = new THREE.Euler().setFromQuaternion(quaternion.multiply(currentRotation)); // 다음 회전

                    this.GameObjectInstance.setRotationFromEuler(nextRotation);

                    this.PhysicsComponent.MoveFoward(130);

                //    let N = 3;
                //    let NT = 9.8 * JWFramework.WorldManager.getInstance().GetDeltaTime();
                //    let targetObject = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject);

                //    let RTM_old: THREE.Vector3;
                //    let RTM_new: THREE.Vector3;
                //    let LOS_Delta: THREE.Vector3;
                //    let LOS_Rate: number;

                //    RTM_old = targetObject.previousPosition.clone().sub(this.previousPosition);
                //    RTM_new = targetObject.physicsComponent.GetPosition().clone().sub(this.physicsComponent.GetPosition());
                //    RTM_old = RTM_old.normalize();
                //    RTM_new = RTM_new.normalize();

                //    if (RTM_old.length() == 0)
                //    {
                //        LOS_Delta = new THREE.Vector3(0, 0, 0);
                //        LOS_Rate = 0;
                //    }
                //    else
                //    {
                //        LOS_Delta = RTM_new.clone().sub(RTM_old);
                //        LOS_Rate = LOS_Delta.clone().length();
                //    }
                //    let Vc: number = LOS_Rate;
                //    let latax1 = RTM_new.clone().multiplyScalar(N * Vc * LOS_Rate);
                //    let latax2 = LOS_Delta.clone().multiplyScalar(NT * (0.5 * N));
                //    let guidance = latax1.clone().add(latax2.clone());

                //    //this.physicsComponent.MoveFoward(130);

                //    let newPos = this.PhysicsComponent.GetPosition().clone().add(guidance);
                //    let newDir = newPos.clone().sub(this.previousPosition).normalize();
                //    let seeDir = newPos.clone().add(newDir.multiplyScalar(10));
                //    this.GameObjectInstance.lookAt(/*seeDir*/newPos.clone());
                }
                if (this.previousPosition)
                {
                    this.currentVelocity = this.PhysicsComponent.GetPosition().clone().sub(this.previousPosition);
                    this.previousPosition = this.physicsComponent.GetPosition().clone();
                }
            }
            else
                this.IsRayOn = false;

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == true) {
                this.axisHelper.visible = true;
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == false) {
                this.axisHelper.visible = false;
            }
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
            if (this.AnimationMixer != null) {
                this.AnimationMixer.update(WorldManager.getInstance().GetDeltaTime());
            }
        }
        public currentVelocity: THREE.Vector3 = new THREE.Vector3(0,0,1);
        private previousPosition: THREE.Vector3;
        private missileOrientation: THREE.Quaternion;
        private isTarget: boolean = false;
        private axisHelper: THREE.AxesHelper;
    }
}