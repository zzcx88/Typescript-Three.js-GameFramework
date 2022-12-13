/// <reference path="../GameObject.d.ts" />
declare namespace JWFramework {
    class Camera extends GameObject {
        constructor();
        get Fov(): number;
        set Fov(fov: number);
        get Aspect(): number;
        set Aspect(aspect: number);
        get Near(): number;
        set Near(near: number);
        get Far(): number;
        set Far(far: number);
        get CameraInstance(): THREE.PerspectiveCamera;
        private SetCameraElement;
        Animate(): void;
        get PhysicsComponent(): PhysicsComponent;
        private y;
        private fov;
        private aspect;
        private near;
        private far;
        private cameraInstance;
    }
}
