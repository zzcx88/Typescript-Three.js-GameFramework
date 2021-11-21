var JWFramework;
(function (JWFramework) {
    class SceneBase {
        constructor() { }
        Animate() { }
        get Terrain() {
            return this.heightmapTerrain;
        }
        set Terrain(terrain) {
            this.heightmapTerrain = terrain;
        }
        get Picker() {
            return this.picker;
        }
        SetPicker() {
            this.picker = new JWFramework.Picker();
        }
    }
    JWFramework.SceneBase = SceneBase;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=SceneBase.js.map