declare namespace JWFramework {
    class GUI_Terrain extends GUI_Base {
        constructor();
        protected CreateFolder(): void;
        protected AddElement(): void;
        GetTerrainOption(): TerrainOption;
        GetHeightOffset(): number;
        ChangeTerrainOption(): void;
        private SetTerrainOptionFromEnum;
        SetTerrainOptionList(): void;
        private datGui;
        private terrainOptionFolder;
        private propList;
        private terrainOption;
    }
}
