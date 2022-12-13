/// <reference path="SceneBase.d.ts" />
/// <reference path="../Manager/ModelLoadManager.d.ts" />
/// <reference path="../Object/Light/Light.d.ts" />
declare namespace JWFramework {
    class EditScene extends SceneBase {
        constructor(sceneManager: SceneManager);
        BuildObject(): void;
        BuildLight(): void;
        BuildFog(): void;
        Animate(): void;
        private light;
        private light2;
    }
}
