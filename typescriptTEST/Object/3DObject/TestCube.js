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
    var TestCube = /** @class */ (function (_super) {
        __extends(TestCube, _super);
        function TestCube() {
            var _this = _super.call(this) || this;
            _this.y = 0;
            _this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            _this.physicsComponent = new JWFramework.PhysicsComponent(_this);
            _this.graphicComponent = new JWFramework.GraphComponent(_this);
            return _this;
        }
        TestCube.prototype.InitializeAfterLoad = function () {
            var axisY = new THREE.Vector3(0, 1, 0);
            this.PhysicsComponent.RotateVec3(axisY, 180);
        };
        Object.defineProperty(TestCube.prototype, "PhysicsComponent", {
            get: function () {
                return this.physicsComponent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TestCube.prototype, "GraphComponent", {
            get: function () {
                return this.graphicComponent;
            },
            enumerable: false,
            configurable: true
        });
        TestCube.prototype.Animate = function () {
            if (JWFramework.InputManager.getInstance().GetKeyState('left')) {
                this.y = -1;
                this.PhysicsComponent.Rotate(0, this.y, 0);
            }
            if (JWFramework.InputManager.getInstance().GetKeyState('right')) {
                this.y = 1;
                this.PhysicsComponent.Rotate(0, this.y, 0);
            }
            if (JWFramework.InputManager.getInstance().GetKeyState('up')) {
                this.PhysicsComponent.MoveFoward(1);
            }
        };
        return TestCube;
    }(JWFramework.GameObject));
    JWFramework.TestCube = TestCube;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestCube.js.map