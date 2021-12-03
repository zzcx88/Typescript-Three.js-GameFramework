var JWFramework;
(function (JWFramework) {
    class CollisionManager {
        static getInstance() {
            if (!CollisionManager.instance) {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }
        CollisionTerrainSector() {
        }
    }
    JWFramework.CollisionManager = CollisionManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CollisionManager.js.map