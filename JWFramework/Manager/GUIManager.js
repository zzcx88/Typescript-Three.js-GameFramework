var JWFramework;
(function (JWFramework) {
    class GUIManager {
        static getInstance() {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
            }
            return GUIManager.instance;
        }
        get GuiInstance() {
            let guiInstance = new dat.GUI;
            return guiInstance;
        }
        CreateFolder(guiInstance, name) {
            guiInstance.addFolder(name);
        }
    }
    JWFramework.GUIManager = GUIManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUIManager.js.map