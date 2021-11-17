namespace JWFramework {
    export class GUIManager {

        private static instance: GUIManager;

        static getInstance() {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
            }
            return GUIManager.instance;
        }

        public get GuiInstance(): dat.GUI {
            let guiInstance = new dat.GUI;
            return guiInstance;
        }

        public CreateFolder(guiInstance: dat.GUI, name: string) {
            guiInstance.addFolder(name);
        }


    }
}