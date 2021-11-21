namespace JWFramework {
    export class SceneBase {

        constructor() { }

        public Animate() { }

        public get Terrain(): HeightmapTerrain {
            return this.heightmapTerrain;
        }

        public set Terrain(terrain: HeightmapTerrain) {
            this.heightmapTerrain = terrain;
        }

        public get Picker(): Picker {

            return this.picker;
        }

        public SetPicker() {
            this.picker = new Picker();
        }

        private picker: Picker;
        private heightmapTerrain: HeightmapTerrain;
    }
}
