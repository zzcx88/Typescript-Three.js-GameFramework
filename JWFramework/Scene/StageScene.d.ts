declare namespace JWFramework {
    class StageScene extends SceneBase {
        constructor(sceneManager: SceneManager);
        BuildObject(): void;
        BuildLight(): void;
        BuildFog(): void;
        Animate(): void;
        private light;
        private light2;
        private terrain;
    }
}
