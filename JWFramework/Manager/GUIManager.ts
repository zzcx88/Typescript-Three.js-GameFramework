namespace JWFramework {
    export class GUIManager {

        private static instance: GUIManager;

        static getInstance() {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
                GUIManager.instance.gui_SRT = new GUI_SRT(ObjectManager.getInstance().GetObjectFromName("flower"));
                GUIManager.instance.gui_Select = new GUI_Select();
            }
            return GUIManager.instance;
        }

        public get GUI_Select(): GUI_Select {
            return this.gui_Select;
        }

        public get GUI_SRT(): GUI_SRT {
            return this.gui_SRT;
        }

        private gui_Select: GUI_Select;
        private gui_SRT: GUI_SRT;
    }
}