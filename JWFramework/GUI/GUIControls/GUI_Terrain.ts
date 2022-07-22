namespace JWFramework
{
    export class GUI_Terrain extends GUI_Base
    {
        constructor()
        {
            super();
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'terrain-gui-container';

            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
        }

        protected CreateFolder()
        {
            this.terrainOptionFolder = this.datGui.addFolder('Terrain');
        }

        protected AddElement()
        {
            let item = [];

            item.push('UP');
            item.push('DOWN');
            item.push('BALANCE');

            this.terrainOptionFolder.add(this.propList, 'TerrianOptiontList', item).listen();
            this.terrainOptionFolder.add(this.propList, 'HeightOffset').step(0.01).listen();
            this.propList.TerrianOptiontList = 'UP';
            this.terrainOptionFolder.open();

        }

        public GetTerrainOption()
        {
            return this.terrainOption
        }

        public GetHeightOffset()
        {
            return this.propList.HeightOffset;
        }

        public ChangeTerrainOption()
        {

            if (this.terrainOption == TerrainOption.TERRAIN_BALANCE)
                this.terrainOption = TerrainOption.TERRAIN_UP;
            else
                this.terrainOption++;

            this.SetTerrainOptionFromEnum();
        }

        private SetTerrainOptionFromEnum()
        {
            if (this.terrainOption == TerrainOption.TERRAIN_UP)
                this.propList.TerrianOptiontList = 'UP'
            if (this.terrainOption == TerrainOption.TERRAIN_DOWN)
                this.propList.TerrianOptiontList = 'DOWN'
            if (this.terrainOption == TerrainOption.TERRAIN_BALANCE)
                this.propList.TerrianOptiontList = 'BALANCE'
        }

        public SetTerrainOptionList()
        {
            if (this.propList.TerrianOptiontList == 'UP')
                this.terrainOption = TerrainOption.TERRAIN_UP;
            if (this.propList.TerrianOptiontList == 'DOWN')
                this.terrainOption = TerrainOption.TERRAIN_DOWN;
            if (this.propList.TerrianOptiontList == 'BALANCE')
                this.terrainOption = TerrainOption.TERRAIN_BALANCE;
        }


        private datGui: dat.GUI;
        private terrainOptionFolder: dat.GUI;
        private propList = {
            TerrianOptiontList: "None",
            HeightOffset: 0
        };
        private terrainOption: TerrainOption = TerrainOption.TERRAIN_UP;
        //private terrainOffset: number = 0;
    }
}