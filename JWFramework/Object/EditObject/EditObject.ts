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
            this.PhysicsComponent.SetPostion(0, 0, 0);
            this.GameObjectInstance.rotation.x = 0;
            this.GameObjectInstance.rotation.y = 0;
            this.GameObjectInstance.rotation.z = 0;

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
            console.log("충돌");
            if (this.name != "Target" && this.Picked == true)
                this.physicsComponent.SetPostion(0,200, 0);
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
                this.PhysicsComponent.MoveFoward(50);
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Up, -0.5);
            }
            if (this.previousPosition)
            {
                this.currentVelocity = this.PhysicsComponent.GetPosition().clone().sub(this.previousPosition);
                this.previousPosition = this.physicsComponent.GetPosition();
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
                    this.PhysicsComponent.MoveFoward(70);
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
                    
                    let currentTime = performance.now();
                    let targetPos = ObjectManager.getInstance().GetObjectFromName("Target").PhysicsComponent.GetPosition();

                    let missileDirection = targetPos.clone().sub(this.PhysicsComponent.GetPosition().clone());
                    //this.currentVelocity.addScalar(missileDirection.length());
                    let relativeVelocity = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject).currentVelocity.clone().sub(this.currentVelocity);
                    let missileAcceleration = missileDirection.multiplyScalar(100 / Math.pow(missileDirection.length(), 2)).sub(relativeVelocity.multiplyScalar(100 / missileDirection.length()));
                    this.GameObjectInstance.lookAt(targetPos.clone());
                    //this.PhysicsComponent.MoveDirection(missileDirection, 100);
                    this.physicsComponent.SetPostionVec3(this.physicsComponent.GetPosition().add(missileAcceleration));


                    //let relativePosition = targetPos.clone().sub(this.PhysicsComponent.GetPosition());
                    //let relativeVelocity = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject).currentVelocity.clone().sub(this.currentVelocity);
                    //let relativeRange = relativePosition.length();
                    //let rangeRate = relativePosition.dot(relativeVelocity) / relativeRange;
                    //let missileAcceleration = relativePosition.multiplyScalar(800 / Math.pow(relativeRange, 2)).sub(relativeVelocity.multiplyScalar(800 / relativeRange));
                    //this.physicsComponent.SetPostionVec3(this.physicsComponent.GetPosition().add(missileAcceleration));

                    //this.missileOrientation = this.gameObjectInstance.quaternion;
                    //let direction = this.previousPosition.clone().sub(this.physicsComponent.GetPosition().clone()).normalize();
                    //let targetOrientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
                    //this.missileOrientation = this.missileOrientation.slerp(targetOrientation, 1);
                    //this.GameObjectInstance.setRotationFromQuaternion(this.missileOrientation);


                    //this.GameObjectInstance.lookAt(targetPos);
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
        public currentVelocity: THREE.Vector3;
        private previousPosition: THREE.Vector3;
        private missileOrientation: THREE.Quaternion;
        private isTarget: boolean = false;
        private testpos = 0;
        private axisHelper: THREE.AxesHelper;
    }
}