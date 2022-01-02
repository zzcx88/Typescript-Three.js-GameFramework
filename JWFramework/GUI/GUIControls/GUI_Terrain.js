var JWFramework;
(function (JWFramework) {
    class GUI_Terrian extends JWFramework.GUI_Base {
        constructor() {
            super();
            this.List = {
                TerrianOptiontList: 'None'
            };
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'terrain-gui-container';
            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
        }
        CreateFolder() {
            this.terrainOptionFolder = this.datGui.addFolder('ObjectList');
        }
        AddElement() {
            let item = ['Up', 'Down', 'Balance'];
            this.terrainOptionFolder.add(this.List, 'TerrianOptiontList', item);
            this.terrainOptionFolder.open();
        }
        GetTerrainOptionName() {
            return this.List.TerrianOptiontList;
        }
    }
    JWFramework.GUI_Terrian = GUI_Terrian;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUI_Terrain.js.map