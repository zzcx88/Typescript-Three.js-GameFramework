/// <reference path="../../GameObject.d.ts" />
declare namespace JWFramework {
    class HeightmapTerrain extends GameObject {
        constructor(x: number, z: number, segmentWidth: number, segmentHeight: number);
        InitializeAfterLoad(): void;
        CreateBoundingBox(): void;
        CreateTerrainMesh(): void;
        get HeightIndexBuffer(): number[];
        get HeightBuffer(): number[];
        SetHeight(index: number, value?: number, option?: TerrainOption): void;
        CollisionActive(value: ObjectType): void;
        CollisionDeActive(value: ObjectType): void;
        Animate(): void;
        private planeMesh;
        private planeGeomatry;
        private material;
        private texture;
        private gradientmap;
        private terrainIndex;
        private width;
        private height;
        private segmentWidth;
        private segmentHeight;
        private heigtIndexBuffer;
        private heigtBuffer;
        private vertexNormalNeedUpdate;
        inSecter: boolean;
        cameraInSecter: boolean;
    }
}
