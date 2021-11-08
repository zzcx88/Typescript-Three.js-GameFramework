var JWFramework;
(function (JWFramework) {
    var SceneBase = /** @class */ (function () {
        function SceneBase() {
        }
        SceneBase.prototype.Animate = function () { };
        Object.defineProperty(SceneBase.prototype, "Picker", {
            get: function () {
                return this.picker;
            },
            enumerable: false,
            configurable: true
        });
        SceneBase.prototype.SetPicker = function () {
            this.picker = new JWFramework.Picker();
        };
        return SceneBase;
    }());
    JWFramework.SceneBase = SceneBase;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=SceneBase.js.map