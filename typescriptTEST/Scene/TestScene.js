var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var JWFramework;
(function (JWFramework) {
    var TestScene = /** @class */ (function (_super) {
        __extends(TestScene, _super);
        function TestScene(sceneManager) {
            var _this = _super.call(this) || this;
            _this.sceneManager = sceneManager;
            _this.light = new JWFramework.Light();
            _this.BuildObject();
            _this.BuildLight();
            _this.SetPicker();
            return _this;
        }
        TestScene.prototype.BuildObject = function () {
            JWFramework.ModelLoadManager.getInstance().LoadSceneTest();
            //this.Picker.ClearPickPosition();
        };
        TestScene.prototype.BuildLight = function () {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(-1, 4, 4);
            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        };
        TestScene.prototype.Animate = function () {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                //this.Picker.Pick();
            }
        };
        return TestScene;
    }(JWFramework.SceneBase));
    JWFramework.TestScene = TestScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestScene.js.map