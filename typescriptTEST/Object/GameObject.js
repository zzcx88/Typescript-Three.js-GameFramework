var JWFramework;
(function (JWFramework) {
    var GameObject = /** @class */ (function () {
        function GameObject() {
            this.physicsCompIncluded = false;
            this.graphicCompIncluded = false;
            this.picked = false;
        }
        GameObject.prototype.InitializeAfterLoad = function () { };
        Object.defineProperty(GameObject.prototype, "Type", {
            get: function () {
                return this.type;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "Name", {
            get: function () {
                return this.name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "PhysicsComponent", {
            get: function () {
                return this.physicsComponent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "GraphicComponent", {
            get: function () {
                return this.graphicComponent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "PhysicsCompIncluded", {
            get: function () {
                return this.physicsCompIncluded;
            },
            set: function (isIncluded) {
                this.physicsCompIncluded = isIncluded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "GraphicCompIncluded", {
            get: function () {
                return this.graphicCompIncluded;
            },
            set: function (isIncluded) {
                this.graphicCompIncluded = isIncluded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GameObject.prototype, "Picked", {
            get: function () {
                return this.picked;
            },
            set: function (picked) {
                this.picked = picked;
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