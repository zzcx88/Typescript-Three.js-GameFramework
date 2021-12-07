var JWFramework;
(function (JWFramework) {
    class TestObject extends JWFramework.GameObject {
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
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
            }
        }
        CreateCollider() {
            this.CollisionComponent.CreateBoundingBox(1, 1, 1);
            this.CollisionComponent.CreateRaycaster();
        }
        CollisionActive() {
            console.log("Terrain");
        }
        CollisionDeActive() {
            console.log("safe");
        }
        Animate() {
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
            if (this.Picked == true) {
                if (JWFramework.InputManager.getInstance().GetKeyState('left')) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right')) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('down')) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up')) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('w')) {
                    this.PhysicsComponent.MoveFoward(50);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('f')) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_3RD);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('r')) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_ORBIT);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == true) {
                this.axisHelper.visible = true;
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == false) {
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.TestObject = TestObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=testObject.js.map