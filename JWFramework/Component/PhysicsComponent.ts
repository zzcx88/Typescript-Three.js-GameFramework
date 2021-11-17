namespace JWFramework {
    export class PhysicsComponent {
        constructor(gameObject: JWFramework.GameObject) {
            this.GameObject = gameObject;
            this.GameObject.PhysicsCompIncluded = true;
        }

        public get Up(): THREE.Vector3 {
            return this.vec3Up;
        }

        public get Right(): THREE.Vector3 {
            return this.vec3Right;
        }

        public get Look(): THREE.Vector3 {
            return this.vec3Look;
        }

        public SetPostion(x: number, y: number, z: number): void {
            this.GameObject.GameObjectInstance.position.x = x;
            this.GameObject.GameObjectInstance.position.y = y;
            this.GameObject.GameObjectInstance.position.z = z;
            this.UpdateMatrix();
        }

        public SetPostionVec3(vec3: THREE.Vector3): void {
            this.GameObject.GameObjectInstance.position = vec3;
            this.UpdateMatrix();
        }

        public SetScale(x: number, y: number, z: number) {
            this.GameObject.GameObjectInstance.scale.set(x, y, z);
            this.UpdateMatrix();
        }

        public SetScaleScalar(scalar: number) {
            this.GameObject.GameObjectInstance.scale.setScalar(scalar);
            this.UpdateMatrix();
        }

        public MoveFoward(distance: number) {
            this.GameObject.GameObjectInstance.translateOnAxis(this.vec3Look, distance * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        public GetPosition(): THREE.Vector3{
            return this.vec3Position;
        }

        public GetRotateEuler(): THREE.Euler {
            return this.GameObject.GameObjectInstance.rotation;
        }

        public Rotate(x: number, y: number, z: number): void {
            this.GameObject.GameObjectInstance.rotateX(x * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateY(y * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateZ(z * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        public RotateVec3(axis: THREE.Vector3, angle: number): void {
            this.GameObject.GameObjectInstance.setRotationFromAxisAngle(axis, angle * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        public UpdateMatrix() {
            this.vec3Position = this.GameObject.GameObjectInstance.position;

            this.vec3Look = this.vec3Look.crossVectors(this.vec3Right, this.vec3Up);
            this.vec3Right = this.vec3Right.crossVectors(this.vec3Up, this.vec3Look);
            this.vec3Up = this.vec3Up.crossVectors(this.vec3Look, this.vec3Right);
            this.vec3Look = this.vec3Look.crossVectors(this.vec3Right, this.vec3Up);

            this.GameObject.GameObjectInstance.matrix.set(
                this.vec3Right.x, this.vec3Right.y, this.vec3Right.z, 0,
                this.vec3Up.x, this.vec3Up.y, this.vec3Up.z, 0,
                this.vec3Look.x, this.vec3Look.y, this.vec3Look.z,  0,
                this.vec3Position.x, this.vec3Position.y, this.vec3Position.z, 0
            );

            this.GameObject.GameObjectInstance.updateMatrix();
            this.GameObject.GameObjectInstance.updateMatrixWorld(true);
        }

        private gameince: THREE.Object3D;
        private vec3Right:  THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        private vec3Up:     THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        private vec3Look: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        private vec3Position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        private GameObject: JWFramework.GameObject;
    }
}
