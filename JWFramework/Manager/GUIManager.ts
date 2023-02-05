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
                GUIManager.instance.gui_SRT = new GUI_SRT(ObjectManager.getInstance().GetObjectFromName("MainCamera"));
                GUIManager.instance.gui_Select = new GUI_Select();
                GUIManager.instance.gui_Terrain = new GUI_Terrain();
            }
            return GUIManager.instance;
        }

        public get GUI_Select(): GUI_Select
        {
            return this.gui_Select;
        }

        public get GUI_SRT(): GUI_SRT
        {
            return this.gui_SRT;
        }

        public get GUI_Terrain(): GUI_Terrain
        {
            return this.gui_Terrain;
        }

        private gui_Select: GUI_Select;
        private gui_SRT: GUI_SRT;
        private gui_Terrain: GUI_Terrain;
    }
}