var JWFramework;
(function (JWFramework) {
    var ObjectManager = /** @class */ (function () {
        function ObjectManager() {
            this.objectList = [];
        }
        ObjectManager.getInstance = function () {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        };
        ObjectManager.prototype.GetObjectsFromType = function () { };
        ObjectManager.prototype.GetObjectFromName = function (name) {
            for (var i = 0; i < this.objectList.length; ++i) {
                if (name == this.objectList[i].GameObject.Name) {
                    return this.objectList[i].GameObject;
                }
            }
            return null;
        };
        ObjectManager.prototype.GetObjectAll = function () { };
        ObjectManager.prototype.AddObject = function (gameObject, name, type) {
            this.objectList.push({ GameObject: gameObject, Name: name });
        };
        ObjectManager.prototype.DeleteObject = function () { };
        ObjectManager.prototype.RenderOffObject = function () { };
        ObjectManager.prototype.Animate = function () {
            for (var i = 0; i < this.objectList.length; ++i) {
                this.objectList[i].GameObject.Animate();
            }
        };
        ObjectManager.prototype.Render = function () { };
        return ObjectManager;
    }());
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map