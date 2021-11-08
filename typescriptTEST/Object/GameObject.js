var JWFramework;
(function (JWFramework) {
    var GameObject = /** @class */ (function () {
        function GameObject() {
        }
        GameObject.prototype.InitializeAfterLoad = function () { };
        Object.defineProperty(GameObject.prototype, "Type", {
            get: function () {
                return this.type;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "Mesh", {
            get: function () {
                return this.mesh;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "GameObjectInstance", {
            get: function () {
                return this.gameObjectInstance;
            },
            set: function (gameObjectInstance) {
                this.gameObjectInstance = gameObjectInstance;
            },
            enumerable: false,
            configurable: true
        });
        GameObject.prototype.Animate = function () { };
        GameObject.prototype.DeleteObject = function () { };
        return GameObject;
    }());
    JWFramework.GameObject = GameObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GameObject.js.map