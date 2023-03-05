/// <reference path="../Manager/CameraManager.ts" />
namespace JWFramework
{
    export class PhysicsComponent
    {
        constructor(gameObject: JWFramework.GameObject)
        {
            this.GameObject = gameObject;
            this.GameObject.PhysicsCompIncluded = true;
        }

        public get Up(): THREE.Vector3
        {
            return this.vec3Up;
        }

        public get Right(): THREE.Vector3
        {
            return this.vec3Right;
        }

        public get Look(): THREE.Vector3
        {
            return this.vec3Look;
        }

        public set Up(vec3Up: THREE.Vector3)
        {
            this.vec3Up = vec3Up;
        }

        public set Right(vec3Right: THREE.Vector3)
        {
            this.vec3Right = vec3Right;
        }

        public set Look(vec3Look: THREE.Vector3)
        {
            this.vec3Look = vec3Look;
        }

        public SetPostion(x: number, y: number, z: number): void
        {
            this.GameObject.GameObjectInstance.position.x = x;
            this.GameObject.GameObjectInstance.position.y = y;
            this.GameObject.GameObjectInstance.position.z = z;
            this.UpdateMatrix();
        }

        public SetPostionVec3(vec3: THREE.Vector3): void
        {
            this.GameObject.GameObjectInstance.position.x = vec3.x;
            this.GameObject.GameObjectInstance.position.y = vec3.y;
            this.GameObject.GameObjectInstance.position.z = vec3.z;
            this.UpdateMatrix();
        }

        public SetScale(x: number, y: number, z: number)
        {
            this.GameObject.GameObjectInstance.scale.set(x, y, z);
            this.UpdateMatrix();
        }

        public SetScaleScalar(scalar: number)
        {
            this.GameObject.GameObjectInstance.scale.setScalar(scalar);
            this.UpdateMatrix();
        }

        public MoveFoward(distance: number)
        {
            let Look = new THREE.Vector3(0, 0, 1);
            this.GameObject.GameObjectInstance.translateOnAxis(Look, distance * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        public MoveDirection(direction: THREE.Vector3, distance: number) {
            ;
            this.GameObject.GameObjectInstance.translateOnAxis(direction, distance * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        public GetPosition(): THREE.Vector3
        {
            return this.GameObject.GameObjectInstance.position;
        }

        public GetRotateEuler(): THREE.Euler
        {
            return this.GameObject.GameObjectInstance.rotation;
        }

        public GetRotateMatrix3(): THREE.Matrix3
        {
            let rotatematrix = new THREE.Matrix3();
            rotatematrix.set(
                this.Right.x, this.Right.y, this.Right.z,
                this.Up.x, this.Up.y, this.Up.z,
                this.Look.x, this.Look.y, this.Look.z,
            )
            return rotatematrix;
        }

        public GetScale(): THREE.Vector3
        {
            return this.GameObject.GameObjectInstance.scale;
        }

        public GetMatrix4(): THREE.Matrix4
        {
            return this.GameObject.GameObjectInstance.matrixWorld;
        }

         //Object스페이스 축 기준 수치만큼 회전
        public SetRotate(x: number, y: number, z: number): void
        {
            this.GameObject.GameObjectInstance.rotateX(x);
            this.GameObject.GameObjectInstance.rotateY(y);
            this.GameObject.GameObjectInstance.rotateZ(z);
            this.UpdateMatrix();
        }
        //Object스페이스 축 기준 회전
        public Rotate(x: number, y: number, z: number): void
        {
            this.GameObject.GameObjectInstance.rotateX(x * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateY(y * WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateZ(z * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }

        //월드 스페이스 축 기준 회전
        public RotateVec3(axis: THREE.Vector3, angle: number): void
        {
            this.GameObject.GameObjectInstance.rotateOnWorldAxis(axis, angle * WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
            //console.log(this.GameObject.GameObjectInstance.matrix);
        }

        public UpdateMatrix()
        {
            if (this.GameObject.Name != "MainCamera" && CameraManager.getInstance().CameraMode != CameraMode.CAMERA_3RD)
            {
                this.GameObject.GameObjectInstance.getWorldPosition(this.vec3Position);
            }
            else
            {
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

        private gameince: THREE.Object3D;
        private vec3Right: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        private vec3Up: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        private vec3Look: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        private vec3Position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        private GameObject: JWFramework.GameObject;
    }
}
