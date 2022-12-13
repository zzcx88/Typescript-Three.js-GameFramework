var JWFramework;
(function (JWFramework) {
    class GUIManager {
        static getInstance() {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
                GUIManager.instance.gui_SRT = new JWFramework.GUI_SRT(JWFramework.ObjectManager.getInstance().GetObjectFromName("flower"));
                GUIManager.instance.gui_Select = new JWFramework.GUI_Select();
                GUIManager.instance.gui_Terrain = new JWFramework.GUI_Terrain();
            }
            return GUIManager.instance;
        }
        get GUI_Select() {
            return this.gui_Select;
        }
        get GUI_SRT() {
            return this.gui_SRT;
        }
        get GUI_Terrain() {
            return this.gui_Terrain;
        }
    }
    JWFramework.GUIManager = GUIManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUIManager.js.map