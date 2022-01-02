namespace JWFramework {
    export class GUI_Terrian extends GUI_Base {
        constructor() {
            super();
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'terrain-gui-container';

            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
        }

        protected CreateFolder() {
            this.terrainOptionFolder = this.datGui.addFolder('ObjectList');
        }

        protected AddElement() {
            let item = ['Up', 'Down', 'Balance'];

            this.terrainOptionFolder.add(this.List, 'TerrianOptiontList', item);
            this.terrainOptionFolder.open();

        }

        public GetTerrainOptionName() {
            return this.List.TerrianOptiontList;
        }


        private datGui: dat.GUI;
        private terrainOptionFolder: dat.GUI;
        private List = {
            TerrianOptiontList: 'None'
        };
    }
}