var JWFramework;
(function (JWFramework) {
    class F16Object extends JWFramework.AircraftObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_AIRCRAFT;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
                this.CreateCollider();
        }
        CreateCollider() {
            this.CollisionComponent.CreateBoundingBox(1, 1, 1);
            this.CollisionComponent.CreateRaycaster();
        }
        CollisionActive() {
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
            if (this.IsPlayer == true) {
                this.PhysicsComponent.MoveFoward(15);
                if (JWFramework.InputManager.getInstance().GetKeyState('left', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('down', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('w', JWFramework.KeyState.KEY_PRESS)) {
                    //this.PhysicsComponent.MoveFoward(15);
                    this.throttle += 2;
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('f', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_3RD);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('r', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_ORBIT);
                }
            }
        }
    }
    JWFramework.F16Object = F16Object;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=F16Object.js.map