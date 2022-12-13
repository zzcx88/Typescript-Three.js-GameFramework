/// <reference path="../GameObject.d.ts" />
declare namespace JWFramework {
    class EditObject extends GameObject {
        constructor();
        InitializeAfterLoad(): void;
        CreateCollider(): void;
        CollisionActive(): void;
        CollisionDeActive(): void;
        Animate(): void;
        private axisHelper;
    }
}
