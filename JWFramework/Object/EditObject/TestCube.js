var JWFramework;
(function (JWFramework) {
    class TestCube extends JWFramework.GameObject {
        constructor() {
            super();
            this.y = 0;
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
        }
        InitializeAfterLoad() {
            let axisY = new THREE.Vector3(0, 1, 0);
            this.PhysicsComponent.RotateVec3(axisY, 180);
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
        get GraphComponent() {
            return this.graphicComponent;
        }
        Animate() {
            //if (InputManager.getInstance().GetKeyState('left')) {
            //    this.y = -1;
            //    this.PhysicsComponent.Rotate(0, this.y, 0);
            //}
            //if (InputManager.getInstance().GetKeyState('right')) {
            //    this.y = 1;
            //    this.PhysicsComponent.Rotate(0, this.y, 0);
            //}
            //if (InputManager.getInstance().GetKeyState('up')) {
            //    this.PhysicsComponent.MoveFoward(1);
            //}
        }
    }
    JWFramework.TestCube = TestCube;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestCube.js.map