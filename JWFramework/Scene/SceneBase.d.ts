/// <reference path="../Picker/Picker.d.ts" />
declare namespace JWFramework {
    class SceneBase {
        constructor(sceneManager: SceneManager);
        protected BuildObject(): void;
        protected BuildLight(): void;
        protected BuildFog(): void;
        Animate(): void;
        get SceneManager(): SceneManager;
        get Picker(): Picker;
        SetPicker(): void;
        private sceneManager;
        private picker;
    }
}
