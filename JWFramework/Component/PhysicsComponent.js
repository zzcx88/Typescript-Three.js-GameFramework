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
            this.GameObject.GameObjectInstance.position.x = vec3.x;
            this.GameObject.GameObjectInstance.position.y = vec3.y;
            this.GameObject.GameObjectInstance.position.z = vec3.z;
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
            let Look = new THREE.Vector3(0, 0, 1);
            this.GameObject.GameObjectInstance.translateOnAxis(Look, distance * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        GetPosition() {
            return this.GameObject.GameObjectInstance.position;
        }
        GetRotateEuler() {
            return this.GameObject.GameObjectInstance.rotation;
        }
        GetScale() {
            return this.GameObject.GameObjectInstance.scale;
        }
        //Object스페이스 축 기준 회전
        Rotate(x, y, z) {
            this.GameObject.GameObjectInstance.rotateX(x * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateY(y * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateZ(z * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        //월드 스페이스 축 기준 회전
        RotateVec3(axis, angle) {
            this.GameObject.GameObjectInstance.rotateOnWorldAxis(axis, angle * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
            //console.log(this.GameObject.GameObjectInstance.matrix);
        }
        UpdateMatrix() {
            if (this.GameObject.Name != "MainCamera" && JWFramework.CameraManager.getInstance().CameraMode != JWFramework.CameraMode.CAMERA_3RD) {
                this.GameObject.GameObjectInstance.getWorldPosition(this.vec3Position);
            }
            else {
                this.vec3Position = this.GameObject.GameObjectInstance.position;
            }
            this.GameObject.GameObjectInstance.getWorldDirection(this.vec3Look);
            this.vec3Look = this.vec3Look.normalize();
            this.vec3Up.set(this.GameObject.GameObjectInstance.matrix.elements[4], this.GameObject.GameObjectInstance.matrix.elements[5], this.GameObject.GameObjectInstance.matrix.elements[6]);
            this.vec3Up = this.vec3Up.normalize();
            this.vec3Right = this.vec3Right.crossVectors(this.vec3Up, this.vec3Look);
            this.vec3Right = this.vec3Right.normalize();
            //외적하여 나온 방향으로 일정각도 회전한 축을 구할때
            //1. 저장된 벡터와 상대 벡터를 외적한다.
            //2. 외적하여 나온 축에 라디안 값을 곱한다.
            //3. 완성...?
            //this.GameObject.GameObjectInstance.updateMatrix();
            //this.GameObject.GameObjectInstance.updateMatrixWorld(true, true);
        }
    }
    JWFramework.PhysicsComponent = PhysicsComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=PhysicsComponent.js.map