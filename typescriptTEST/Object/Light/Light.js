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
    var Light = /** @class */ (function (_super) {
        __extends(Light, _super);
        function Light() {
            var _this = _super.call(this) || this;
            _this.color = 0x000000;
            _this.intensity = 0;
            _this.light = new THREE.DirectionalLight(_this.color, _this.intensity);
            _this.GameObjectInstance = _this.light;
            return _this;
        }
        Object.defineProperty(Light.prototype, "Color", {
            get: function () {
                return this.color;
            },
            enumerable: false,
            configurable: true
        });
        Light.prototype.SetColor = function (color) {
            this.color = color;
            this.SetLightElement();
        };
        Object.defineProperty(Light.prototype, "Intensity", {
            get: function () {
                return this.intensity;
            },
            set: function (intensity) {
                this.intensity = intensity;
                this.SetLightElement();
            },
            enumerable: false,
            configurable: true
        });
        Light.prototype.SetLightElement = function () {
            this.light.color.set(this.color);
            this.light.intensity = this.intensity;
            this.light.target.position.set(0, 0, 0);
        };
        return Light;
    }(JWFramework.GameObject));
    JWFramework.Light = Light;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Light.js.map