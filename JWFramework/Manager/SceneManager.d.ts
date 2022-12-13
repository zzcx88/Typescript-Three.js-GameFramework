/// <reference path="../Scene/EditScene.d.ts" />
/// <reference path="../Scene/StageScene.d.ts" />
declare namespace JWFramework {
    class SceneManager {
        private static instance;
        constructor();
        static getInstance(): SceneManager;
        get SceneInstance(): THREE.Scene;
        get CurrentScene(): SceneBase;
        get SceneType(): SceneType;
        MakeJSON(): void;
        BuildScene(): void;
        Animate(): void;
        private sceneThree;
        private sceneType;
        private scene;
        private objectManager;
    }
}
