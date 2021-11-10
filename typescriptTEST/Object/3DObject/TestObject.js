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
    var TestObject = /** @class */ (function (_super) {
        __extends(TestObject, _super);
        function TestObject() {
            var _this = _super.call(this) || this;
            _this.y = 0;
            _this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            _this.physicsComponent = new JWFramework.PhysicsComponent(_this);
            _this.graphicComponent = new JWFramework.GraphComponent(_this);
            _this.name = "Ref_helmet";
            return _this;
        }
        TestObject.prototype.InitializeAfterLoad = function () {
            var axisY = new THREE.Vector3(0, 1, 0);
            this.PhysicsComponent.SetScaleScalar(0.1);
            this.PhysicsComponent.Rotate(0, 180, 0);
            this.GameObjectInstance.name = this.name;
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST) {
                this.guiComponent = new JWFramework.GUIComponent(this);
            }
        };
        TestObject.prototype.Animate = function () {
            if (this.Picked == true) {
                console.log(this.name, this.Picked);
                if (JWFramework.InputManager.getInstance().GetKeyState('left')) {
                    this.y = 1;
                    this.PhysicsComponent.Rotate(0, this.y, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right')) {
                    this.y = -1;
                    this.PhysicsComponent.Rotate(0, this.y, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up')) {
                    this.PhysicsComponent.MoveFoward(1);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == true) {
                this.guiComponent.ShowGUI(true);
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == false) {
                this.guiComponent.ShowGUI(false);
            }
        };
        return TestObject;
    }(JWFramework.GameObject));
    JWFramework.TestObject = TestObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestObject.js.map