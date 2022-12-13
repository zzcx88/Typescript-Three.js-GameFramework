/// <reference path="../Object/CommonObject/Terrain/HeightmapTerrain.d.ts" />
declare namespace JWFramework {
    class ModelLoadManager {
        private static instance;
        static getInstance(): ModelLoadManager;
        constructor();
        private SetLoadComplete;
        get LoadComplete(): boolean;
        LoadScene(): void;
        private LoadModel;
        private LoadHeightmapTerrain;
        private loaderManager;
        private gltfLoader;
        private loadCompletModel;
        private modelCount;
        private loadComplete;
        private modeltList;
        private terrain;
    }
}
