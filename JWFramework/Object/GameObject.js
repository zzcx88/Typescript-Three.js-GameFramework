var JWFramework;
(function (JWFramework) {
    class GameObject {
        constructor() {
            this.isClone = false;
            this.isDead = false;
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
        get IsClone() {
            return this.isClone;
        }
        set IsClone(isClone) {
            this.isClone = isClone;
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
        get GraphicComponent() {
            return this.graphicComponent;
        }
        get GUIComponent() {
            return this.guiComponent;
        }
        get ExportComponent() {
            return this.exportComponent;
        }
        get PhysicsCompIncluded() {
            return this.physicsCompIncluded;
        }
        get GraphicCompIncluded() {
            return this.graphicCompIncluded;
        }
        set PhysicsCompIncluded(isIncluded) {
            this.physicsCompIncluded = isIncluded;
        }
        set GraphicCompIncluded(isIncluded) {
            this.graphicCompIncluded = isIncluded;
        }
        set Picked(picked) {
            this.picked = picked;
        }
        get Picked() {
            return this.picked;
        }
        get GameObjectInstance() {
            return this.gameObjectInstance;
        }
        set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance;
        }
        get IsDead() {
            return this.isDead;
        }
        Animate() { }
        DeleteObject() {
            this.isDead = true;
        }
    }
    JWFramework.GameObject = GameObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GameObject.js.map