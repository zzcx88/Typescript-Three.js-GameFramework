var JWFramework;
(function (JWFramework) {
    class TestObject extends JWFramework.GameObject {
        constructor() {
            super();
            this.distance = 0;
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = false;
            this.PhysicsComponent.SetScaleScalar(0.1);
            this.PhysicsComponent.SetPostion(0, 0, -20);
            this.gameObjectInstance.rotation.x = 0;
            this.gameObjectInstance.rotation.y = 0;
            this.gameObjectInstance.rotation.z = 0;
            //this.PhysicsComponent.Rotate(0, 180, 0);
            this.GameObjectInstance.name = this.name;
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                this.guiComponent = new JWFramework.GUIComponent(this);
            }
        }
        Animate() {
            if (this.Picked == true) {
                if (JWFramework.InputManager.getInstance().GetKeyState('left')) {
                    this.PhysicsComponent.Rotate(0, 0, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right')) {
                    this.PhysicsComponent.Rotate(0, 0, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('down')) {
                    this.PhysicsComponent.Rotate(-1, 0, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up')) {
                    this.PhysicsComponent.Rotate(1, 0, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('w')) {
                    this.PhysicsComponent.MoveFoward(1);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == true) {
                this.guiComponent.ShowGUI(true);
                this.axisHelper.visible = true;
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == false) {
                this.guiComponent.ShowGUI(false);
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.TestObject = TestObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=testObject.js.map