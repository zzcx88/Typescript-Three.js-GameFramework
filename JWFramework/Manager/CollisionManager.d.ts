declare namespace JWFramework {
    class CollisionManager {
        private static instance;
        static getInstance(): CollisionManager;
        CollideRayToTerrain(sorce: ObjectSet[], destination: ObjectSet[]): void;
        CollideBoxToBox(sorce: ObjectSet[], destination: ObjectSet[]): void;
        CollideObbToObb(sorce: ObjectSet[], destination: ObjectSet[]): void;
        CollideBoxToSphere(sorce: ObjectSet[], destination: ObjectSet[]): void;
        CollideSphereToSphere(sorce: ObjectSet[], destination: ObjectSet[]): void;
    }
}
