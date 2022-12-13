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
        }
    }
    JWFramework.TestCube = TestCube;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestCube.js.map