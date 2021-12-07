namespace JWFramework {
    export class Camera extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_CAMERA;
            this.fov = 75;
            this.aspect = Define.SCREEN_WIDTH / Define.SCREEN_HEIGHT;
            this.near = 0.1;
            this.far = 1000;
            this.cameraInstance = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
            this.GameObjectInstance = this.CameraInstance;
            this.physicsComponent = new PhysicsComponent(this)
            this.collisionComponent = new CollisionComponent(this);
            this.CollisionComponent.CreateBoundingBox(1,1,1);
            this.GameObjectInstance.matrixAutoUpdate = true;
        }

        public get Fov(): number {
            return this.fov;
        }
        public set Fov(fov: number) {
            this.fov = fov;
            this.SetCameraElement();
        }

        public get Aspect(): number {
            return this.aspect;
        }
        public set Aspect(aspect: number) {
            this.aspect = aspect;
            this.SetCameraElement();
        }

        public get Near(): number {
            return this.Near;
        }
        public set Near(near: number) {
            this.near = near;
            this.SetCameraElement();
        }

        public get Far(): number {
            return this.far;
        }
        public set Far(far: number) {
            this.far = far;
            this.SetCameraElement();
        }

        public get CameraInstance(): THREE.PerspectiveCamera {
            return this.cameraInstance;
        }

        private SetCameraElement() {
            this.cameraInstance.fov = this.fov;
            this.cameraInstance.aspect = this.aspect;
            this.cameraInstance.near = this.near;
            this.cameraInstance.far = this.far;
            this.cameraInstance.updateProjectionMatrix();
        }

        public Animate() {
            this.CollisionComponent.Update();
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
            this.PhysicsComponent.UpdateMatrix();
        }

        public get PhysicsComponent(): PhysicsComponent {
            return this.physicsComponent;
        }

        private y = 0;

        private fov: number;
        private aspect: number;
        private near: number;
        private far: number;
        private cameraInstance: THREE.PerspectiveCamera;
    }
}