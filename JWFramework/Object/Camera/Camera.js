var JWFramework;
(function (JWFramework) {
    class Camera extends JWFramework.GameObject {
        constructor() {
            super();
            this.y = 0;
            this.type = JWFramework.ObjectType.OBJ_CAMERA;
            this.fov = 75;
            this.aspect = JWFramework.Define.SCREEN_WIDTH / JWFramework.Define.SCREEN_HEIGHT;
            this.near = 0.1;
            this.far = 1000;
            this.cameraInstance = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
            this.GameObjectInstance = this.CameraInstance;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
        }
        get Fov() {
            return this.fov;
        }
        set Fov(fov) {
            this.fov = fov;
            this.SetCameraElement();
        }
        get Aspect() {
            return this.aspect;
        }
        set Aspect(aspect) {
            this.aspect = aspect;
            this.SetCameraElement();
        }
        get Near() {
            return this.Near;
        }
        set Near(near) {
            this.near = near;
            this.SetCameraElement();
        }
        get Far() {
            return this.far;
        }
        set Far(far) {
            this.far = far;
            this.SetCameraElement();
        }
        get CameraInstance() {
            return this.cameraInstance;
        }
        SetCameraElement() {
            this.cameraInstance.fov = this.fov;
            this.cameraInstance.aspect = this.aspect;
            this.cameraInstance.near = this.near;
            this.cameraInstance.far = this.far;
            this.cameraInstance.updateProjectionMatrix();
        }
        Animate() {
            //if (InputManager.getInstance().GetKeyState('left')) {
            //    this.y = 1;
            //    this.PhysicsComponent.Rotate(0, this.y, 0);
            //}
            //if (InputManager.getInstance().GetKeyState('right')) {
            //    this.y = -1;
            //    this.PhysicsComponent.Rotate(0, this.y, 0);
            //}
            //if (InputManager.getInstance().GetKeyState('up')) {
            //    this.PhysicsComponent.MoveFoward(-1);
            //}
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
    }
    JWFramework.Camera = Camera;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Camera.js.map