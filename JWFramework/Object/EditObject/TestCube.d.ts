/// <reference path="../GameObject.d.ts" />
declare namespace JWFramework {
    class TestCube extends GameObject {
        constructor();
        InitializeAfterLoad(): void;
        get PhysicsComponent(): PhysicsComponent;
        get GraphComponent(): GraphComponent;
        Animate(): void;
        private y;
    }
}
