var JWFramework;
(function (JWFramework) {
    class SceneBase {
        constructor() { }
        Animate() { }
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