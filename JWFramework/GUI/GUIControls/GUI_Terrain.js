var JWFramework;
(function (JWFramework) {
    class GUI_Terrain extends JWFramework.GUI_Base {
        constructor() {
            super();
            this.propList = {
                TerrianOptiontList: "None",
                HeightOffset: 0
            };
            this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'terrain-gui-container';
            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
        }
        CreateFolder() {
            this.terrainOptionFolder = this.datGui.addFolder('Terrain');
        }
        AddElement() {
            let item = [];
            item.push('UP');
            item.push('DOWN');
            item.push('BALANCE');
            this.terrainOptionFolder.add(this.propList, 'TerrianOptiontList', item).listen();
            this.terrainOptionFolder.add(this.propList, 'HeightOffset').step(0.01).listen();
            this.propList.TerrianOptiontList = 'UP';
            this.terrainOptionFolder.open();
        }
        GetTerrainOption() {
            return this.terrainOption;
        }
        GetHeightOffset() {
            return this.propList.HeightOffset;
        }
        ChangeTerrainOption() {
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_BALANCE)
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            else
                this.terrainOption++;
            this.SetTerrainOptionFromEnum();
        }
        SetTerrainOptionFromEnum() {
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_UP)
                this.propList.TerrianOptiontList = 'UP';
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_DOWN)
                this.propList.TerrianOptiontList = 'DOWN';
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_BALANCE)
                this.propList.TerrianOptiontList = 'BALANCE';
        }
        SetTerrainOptionList() {
            if (this.propList.TerrianOptiontList == 'UP')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            if (this.propList.TerrianOptiontList == 'DOWN')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_DOWN;
            if (this.propList.TerrianOptiontList == 'BALANCE')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_BALANCE;
        }
    }
    JWFramework.GUI_Terrain = GUI_Terrain;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUI_Terrain.js.map