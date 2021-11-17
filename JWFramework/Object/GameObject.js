var JWFramework;
(function (JWFramework) {
    class GameObject {
        constructor() {
            this.physicsCompIncluded = false;
            this.graphicCompIncluded = false;
            this.picked = false;
        }
        InitializeAfterLoad() { }
        get Type() {
            return this.type;
        }
        get Name() {
            return this.name;
        }
        set Name(name) {
            this.name = name;
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
        get GraphicComponent() {
            return this.graphicComponent;
        }
        get PhysicsCompIncluded() {
            return this.physicsCompIncluded;
        }
        get GraphicCompIncluded() {
            return this.graphicCompIncluded;
        }
        set Picked(picked) {
            this.picked = picked;
        }
        get Picked() {
            return this.picked;
        }
        set PhysicsCompIncluded(isIncluded) {
            this.physicsCompIncluded = isIncluded;
        }
        set GraphicCompIncluded(isIncluded) {
            this.graphicCompIncluded = isIncluded;
        }
        get GameObjectInstance() {
            return this.gameObjectInstance;
        }
        set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance;
        }
        Animate() { }
        DeleteObject() { }
    }
    JWFramework.GameObject = GameObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GameObject.js.map