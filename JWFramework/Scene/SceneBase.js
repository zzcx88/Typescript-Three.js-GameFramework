var JWFramework;
(function (JWFramework) {
    class SceneBase {
        constructor(sceneManager) {
            this.sceneManager = sceneManager;
            this.BuildObject();
            this.BuildLight();
            this.BuildFog();
            this.SetPicker();
        }
        BuildObject() { }
        BuildLight() { }
        BuildFog() { }
        Animate() { }
        get SceneManager() {
            return this.sceneManager;
        }
        get Picker() {
            return this.picker;
        }
        SetPicker() {
            this.picker = new JWFramework.Picker();
        }
    }
    JWFramework.SceneBase = SceneBase;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=SceneBase.js.map