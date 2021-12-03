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
            //클론은 게임오브젝트인스턴스를 씬에 add한다.
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.PhysicsComponent.SetPostion(0, 0, 0);
            this.GameObjectInstance.rotation.x = 0;
            this.GameObjectInstance.rotation.y = 0;
            this.GameObjectInstance.rotation.z = 0;
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                //this.guiComponent = new GUIComponent(this);
            }
            if (this.isClone == true) {
                this.CreateBoundingBox();
            }
        }
        CreateBoundingBox() {
            this.CollisionComponet.CreateBoundingBox();
            this.CollisionComponet.CreateRaycaster();
        }
        Animate() {
            //if (this.name == "F-16")
            //    this.Picked = true;
            if (this.isClone == true) {
                this.CollisionComponet.Update();
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
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(this);
                    JWFramework.SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = false;
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == true) {
                //this.GUIComponent.ShowGUI(true);
                this.axisHelper.visible = true;
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == false) {
                //this.GUIComponent.ShowGUI(false);
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.TestObject = TestObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=testObject.js.map