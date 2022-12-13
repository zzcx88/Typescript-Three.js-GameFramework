var JWFramework;
(function (JWFramework) {
    class EditObject extends JWFramework.GameObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.PhysicsComponent.SetPostion(0, 0, 0);
            this.GameObjectInstance.rotation.x = 0;
            this.GameObjectInstance.rotation.y = 0;
            this.GameObjectInstance.rotation.z = 0;
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
                this.CreateCollider();
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
            }
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), this.PhysicsComponent.GetScale());
            this.CollisionComponent.CreateRaycaster();
        }
        CollisionActive() {
            console.log("충돌");
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
            if (this.Picked == true) {
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
                    this.PhysicsComponent.MoveFoward(15);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('f', JWFramework.KeyState.KEY_PRESS)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_3RD);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('r', JWFramework.KeyState.KEY_PRESS)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_ORBIT);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT && this.Picked == true) {
                this.axisHelper.visible = true;
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT && this.Picked == false) {
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.EditObject = EditObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=EditObject.js.map