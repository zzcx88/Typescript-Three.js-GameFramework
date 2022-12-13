declare namespace JWFramework {
    class CameraManager {
        private static instance;
        static getInstance(): CameraManager;
        get CameraMode(): CameraMode;
        SetCameraSavedPosition(cameraMode: CameraMode): void;
        private ChangeThridPersonCamera;
        private ChangeOrbitCamera;
        private cameraMode;
    }
}
