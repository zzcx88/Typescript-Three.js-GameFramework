/// <reference path="../Object/Camera/Camera.d.ts" />
/// <reference path="ObjectManager.d.ts" />
/// <reference path="SceneManager.d.ts" />
/// <reference path="ShaderManager.d.ts" />
declare namespace JWFramework {
    class WorldManager {
        private static instance;
        private constructor();
        static getInstance(): WorldManager;
        InitializeWorld(): void;
        private CreateRendere;
        private ResizeView;
        private CreateMainCamera;
        private CreateScene;
        private CreateDeltaTime;
        GetDeltaTime(): number;
        get Canvas(): HTMLCanvasElement;
        get MainCamera(): JWFramework.Camera;
        get Renderer(): THREE.WebGLRenderer;
        Animate(): void;
        Render(): void;
        private renderer;
        private sceneManager;
        private camera;
        private clock;
        private delta;
    }
}
