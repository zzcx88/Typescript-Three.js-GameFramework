var JWFramework;
(function (JWFramework) {
    var GUIManager = /** @class */ (function () {
        function GUIManager() {
        }
        GUIManager.getInstance = function () {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
            }
            return GUIManager.instance;
        };
        Object.defineProperty(GUIManager.prototype, "GuiInstance", {
            get: function () {
                var guiInstance = new dat.GUI;
                return guiInstance;
            },
            enumerable: false,
            configurable: true
        });
        GUIManager.prototype.CreateFolder = function (guiInstance, name) {
            guiInstance.addFolder(name);
        };
        return GUIManager;
    }());
    JWFramework.GUIManager = GUIManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUIManager.js.map