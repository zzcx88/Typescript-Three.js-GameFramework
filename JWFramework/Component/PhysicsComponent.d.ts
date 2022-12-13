/// <reference path="../Manager/CameraManager.d.ts" />
declare namespace JWFramework {
    class PhysicsComponent {
        constructor(gameObject: JWFramework.GameObject);
        get Up(): THREE.Vector3;
        get Right(): THREE.Vector3;
        get Look(): THREE.Vector3;
        set Up(vec3Up: THREE.Vector3);
        set Right(vec3Right: THREE.Vector3);
        set Look(vec3Look: THREE.Vector3);
        SetPostion(x: number, y: number, z: number): void;
        SetPostionVec3(vec3: THREE.Vector3): void;
        SetScale(x: number, y: number, z: number): void;
        SetScaleScalar(scalar: number): void;
        MoveFoward(distance: number): void;
        GetPosition(): THREE.Vector3;
        GetRotateEuler(): THREE.Euler;
        GetScale(): THREE.Vector3;
        GetMatrix4(): any;
        Rotate(x: number, y: number, z: number): void;
        RotateVec3(axis: THREE.Vector3, angle: number): void;
        UpdateMatrix(): void;
        private gameince;
        private vec3Right;
        private vec3Up;
        private vec3Look;
        private vec3Position;
        private GameObject;
    }
}
