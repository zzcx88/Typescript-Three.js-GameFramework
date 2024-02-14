namespace JWFramework
{
    export class GUIManager
    {

        private static instance: GUIManager;

        static getInstance()
        {
            if (!GUIManager.instance)
            {
                GUIManager.instance = new GUIManager;
            }
            return GUIManager.instance;
        }

        public get GUI_Select(): GUI_Select
        {
            if (this.gui_Select == null)
                GUIManager.instance.gui_Select = new GUI_Select();
            return this.gui_Select;
        }

        public get GUI_SRT(): GUI_SRT
        {
            if (this.gui_SRT == null)
                GUIManager.instance.gui_SRT = new GUI_SRT(ObjectManager.getInstance().GetObjectFromName("MainCamera"));
            return this.gui_SRT;
        }

        public get GUI_Terrain(): GUI_Terrain
        {
            if (this.gui_Terrain == null)
                GUIManager.instance.gui_Terrain = new GUI_Terrain();
            return this.gui_Terrain;
        }

        private gui_Select: GUI_Select;
        private gui_SRT: GUI_SRT;
        private gui_Terrain: GUI_Terrain;
    }
}