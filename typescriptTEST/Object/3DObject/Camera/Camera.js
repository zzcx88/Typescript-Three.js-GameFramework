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
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            var _this = _super.call(this) || this;
            _this.type = JWFramework.ObjectType.OBJ_CAMERA;
            _this.fov = 75;
            _this.aspect = JWFramework.Define.SCREEN_WIDTH / JWFramework.Define.SCREEN_HEIGHT;
            _this.near = 0.1;
            _this.far = 1000;
            _this.cameraInstance = new THREE.PerspectiveCamera(_this.fov, _this.aspect, _this.near, _this.far);
            _this.GameObjectInstance = _this.CameraInstance;
            _this.physicsComponent = new JWFramework.PhysicsComponent(_this);
            return _this;
        }
        Object.defineProperty(Camera.prototype, "Fov", {
            get: function () {
                return this.fov;
            },
            set: function (fov) {
                this.fov = fov;
                this.SetCameraElement();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "Aspect", {
            get: function () {
                return this.aspect;
            },
            set: function (aspect) {
                this.aspect = aspect;
                this.SetCameraElement();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "Near", {
            get: function () {
                return this.Near;
            },
            set: function (near) {
                this.near = near;
                this.SetCameraElement();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "Far", {
            get: function () {
                return this.far;
            },
            set: function (far) {
                this.far = far;
                this.SetCameraElement();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "CameraInstance", {
            get: function () {
                return this.cameraInstance;
            },
            enumerable: false,
            configurable: true
        });
        Camera.prototype.SetCameraElement = function () {
            this.cameraInstance.fov = this.fov;
            this.cameraInstance.aspect = this.aspect;
            this.cameraInstance.near = this.near;
            this.cameraInstance.far = this.far;
            this.cameraInstance.updateProjectionMatrix();
        };
        Object.defineProperty(Camera.prototype, "PhysicsComponent", {
            get: function () {
                return this.physicsComponent;
            },
            enumerable: false,
            configurable: true
        });
        return Camera;
    }(JWFramework.GameObject));
    JWFramework.Camera = Camera;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Camera.js.map