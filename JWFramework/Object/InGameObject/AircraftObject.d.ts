declare namespace JWFramework {
    class AircraftObject extends GameObject {
        constructor();
        InitializeAfterLoad(): void;
        CreateCollider(): void;
        CollisionActive(): void;
        CollisionDeActive(): void;
        Animate(): void;
        protected throttle: number;
        protected afterBurner: boolean;
        protected acceleration: number;
    }
}
