declare namespace JWFramework {
    class GUIManager {
        private static instance;
        static getInstance(): GUIManager;
        get GUI_Select(): GUI_Select;
        get GUI_SRT(): GUI_SRT;
        get GUI_Terrain(): GUI_Terrain;
        private gui_Select;
        private gui_SRT;
        private gui_Terrain;
    }
}
