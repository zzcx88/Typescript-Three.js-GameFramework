declare namespace JWFramework {
    class F16Object extends AircraftObject {
        constructor();
        InitializeAfterLoad(): void;
        CreateCollider(): void;
        CollisionActive(): void;
        CollisionDeActive(): void;
        Animate(): void;
    }
}
