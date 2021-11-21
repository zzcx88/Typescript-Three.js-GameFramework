var JWFramework;
(function (JWFramework) {
    class PhysicsComponent {
        constructor(gameObject) {
            this.vec3Right = new THREE.Vector3(1, 0, 0);
            this.vec3Up = new THREE.Vector3(0, 1, 0);
            this.vec3Look = new THREE.Vector3(0, 0, 1);
            this.vec3Position = new THREE.Vector3(0, 0, 0);
            this.GameObject = gameObject;
            this.GameObject.PhysicsCompIncluded = true;
        }
        get Up() {
            return this.vec3Up;
        }
        get Right() {
            return this.vec3Right;
        }
        get Look() {
            return this.vec3Look;
        }
        set Up(vec3Up) {
            this.vec3Up = vec3Up;
        }
        set Right(vec3Right) {
            this.vec3Right = vec3Right;
        }
        set Look(vec3Look) {
            this.vec3Look = vec3Look;
        }
        SetPostion(x, y, z) {
            this.GameObject.GameObjectInstance.position.x = x;
            this.GameObject.GameObjectInstance.position.y = y;
            this.GameObject.GameObjectInstance.position.z = z;
            this.UpdateMatrix();
        }
        SetPostionVec3(vec3) {
            this.GameObject.GameObjectInstance.position = vec3;
            this.UpdateMatrix();
        }
        SetScale(x, y, z) {
            this.GameObject.GameObjectInstance.scale.set(x, y, z);
            this.UpdateMatrix();
        }
        SetScaleScalar(scalar) {
            this.GameObject.GameObjectInstance.scale.setScalar(scalar);
            this.UpdateMatrix();
        }
        MoveFoward(distance) {
            this.GameObject.GameObjectInstance.translateOnAxis(this.vec3Look, distance * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        GetPosition() {
            return this.vec3Position;
        }
        GetRotateEuler() {
            return this.GameObject.GameObjectInstance.rotation;
        }
        Rotate(x, y, z) {
            this.GameObject.GameObjectInstance.rotateX(x * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateY(y * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateZ(z * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        RotateVec3(axis, angle) {
            this.GameObject.GameObjectInstance.setRotationFromAxisAngle(axis, angle * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        UpdateMatrix() {
            this.vec3Position = this.GameObject.GameObjectInstance.position;
            //this.vec3Look = this.vec3Look.crossVectors(this.vec3Right, this.vec3Up);
            //this.vec3Right = this.vec3Right.crossVectors(this.vec3Up, this.vec3Look);
            //this.vec3Up = this.vec3Up.crossVectors(this.vec3Look, this.vec3Right);
            //this.vec3Look = this.vec3Look.crossVectors(this.vec3Right, this.vec3Up);
            if (this.GameObject.Name == "F-16")
                console.log(this.vec3Look);
            //this.gameince.matrix.elements[]
            //this.vec3Right.set(this.GameObject.GameObjectInstance.matrix.elements[0], this.GameObject.GameObjectInstance.matrix.elements[1], this.GameObject.GameObjectInstance.matrix.elements[2]);
            //this.vec3Up.set(this.GameObject.GameObjectInstance.matrix.elements[4], this.GameObject.GameObjectInstance.matrix.elements[5], this.GameObject.GameObjectInstance.matrix.elements[6]);
            //this.vec3Look.set(this.GameObject.GameObjectInstance.matrix.elements[8], this.GameObject.GameObjectInstance.matrix.elements[9], this.GameObject.GameObjectInstance.matrix.elements[10]);
            //this.GameObject.GameObjectInstance.matrix.set(
            //    this.vec3Right.x, this.vec3Right.y, this.vec3Right.z, 0,
            //    this.vec3Up.x, this.vec3Up.y, this.vec3Up.z, 0,
            //    this.vec3Look.x, this.vec3Look.y, this.vec3Look.z,  0,
            //    this.vec3Position.x, this.vec3Position.y, this.vec3Position.z, 0
            //);
            //this.GameObject.GameObjectInstance.updateMatrix();
            //this.GameObject.GameObjectInstance.updateMatrixWorld(true);
        }
    }
    JWFramework.PhysicsComponent = PhysicsComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=PhysicsComponent.js.map