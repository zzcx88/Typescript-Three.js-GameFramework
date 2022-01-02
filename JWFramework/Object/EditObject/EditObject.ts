namespace JWFramework {
    export class EditObject extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;

            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);
            this.collisionComponent = new CollisionComponent(this);
        }

        public InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.PhysicsComponent.SetPostion(0, 0, 0);
            this.GameObjectInstance.rotation.x = 0;
            this.GameObjectInstance.rotation.y = 0;
            this.GameObjectInstance.rotation.z = 0;

            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
                this.CreateCollider();

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
            }
        }

        public CreateCollider() {
            this.CollisionComponent.CreateBoundingBox(1,1,1);
            this.CollisionComponent.CreateRaycaster();
        }

        public CollisionActive() {
        }

        public CollisionDeActive() {
        }

        public Animate() {
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }

            if (this.Picked == true) {
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
                if (InputManager.getInstance().GetKeyState('w', KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.MoveFoward(15);
                }
                if (InputManager.getInstance().GetKeyState('f', KeyState.KEY_PRESS)) {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
                }
                if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_PRESS)) {
                    CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
                }
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == true) {
                this.axisHelper.visible = true;
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT && this.Picked == false) {
                this.axisHelper.visible = false;
            }
        }
        private axisHelper: THREE.AxesHelper;
    }
}