namespace JWFramework {
    export class GUI_Select extends GUI_Base {
        constructor() {
            super();
            this.datGui = new dat.GUI;
            this.datGui.open();

            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
        }

        protected CreateFolder() {
            this.objectListFolder = this.datGui.addFolder('ObjectList');
        }

        protected AddElement() {
            let item = [];
            for (let i = 0; i < ObjectManager.getInstance().GetObjectList.length; ++i) {
                if (ObjectManager.getInstance().GetObjectList[i].Name != "Terrain")
                    item[i] = ObjectManager.getInstance().GetObjectList[i].Name;
            }
            this.objectListFolder.add(this.List, 'ObjectList', item);
            this.objectListFolder.open();
        }

        public GetSelectObjectName() {
            return this.List.ObjectList;
        }


        private datGui: dat.GUI;
        private objectListFolder: dat.GUI;
        private List = {
            ObjectList: "None"
        };
    }
}