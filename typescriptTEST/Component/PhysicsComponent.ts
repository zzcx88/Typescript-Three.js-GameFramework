namespace JWFramework {
    export class PhysicsComponent {
        constructor(gameObject: JWFramework.GameObject) {
            this.GameObject = gameObject;
            this.GameObject.PhysicsCompIncluded = true;
        }

        public SetPostion(x: number, y: number, z: number): void {
            this.GameObject.GameObjectInstance.position.x = x;
            this.GameObject.GameObjectInstance.position.y = y;
            this.GameObject.GameObjectInstance.position.z = z;
        }

        public SetPostionVec3(vec3: THREE.Vector3): void {
            this.GameObject.GameObjectInstance.position = vec3;
        }

        public SetScale(x: number, y: number, z: number) {
            this.GameObject.GameObjectInstance.scale.set(x, y, z);
        }

        public SetScaleScalar(scalar: number) {
            this.GameObject.GameObjectInstance.scale.setScalar(scalar);
        }

        public MoveFoward(distance: number) {
            this.GameObject.GameObjectInstance.translateOnAxis(this.vec3Look, distance * WorldManager.getInstance().GetDeltaTime());
        }

        public GetRotateEuler(): THREE.Euler {
            return this.GameObject.GameObjectInstance.rotation;
        }

        public Rotate(x: number, y: number, z: number): void {
            this.GameObject.GameObjectInstance.rotation.x += (x * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotation.y += (y * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotation.z += (z * WorldManager.getInstance().GetDeltaTime());
        }

        public RotateVec3(axis: THREE.Vector3, angle: number): void {
            this.GameObject.GameObjectInstance.rotateOnAxis(axis, angle * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.updateMatrix();
        }

        private vec3Look: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        private GameObject: JWFramework.GameObject;
    }
}
