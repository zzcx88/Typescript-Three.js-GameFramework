namespace JWFramework {
    export class CollisionManager {

        private static instance: CollisionManager;

        static getInstance() {
            if (!CollisionManager.instance) {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }

        public CollisionTerrainSector() {
            
        }
    }
}