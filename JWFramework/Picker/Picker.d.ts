declare namespace JWFramework {
    class Picker {
        constructor();
        private CreateOrtbitControl;
        private GetParentName;
        private PickOffObject;
        Pick(): void;
        private GetCanvasReleativePosition;
        get MouseEvent(): MouseEvent;
        SetPickPosition(event: any): void;
        ClearPickPosition(): void;
        ChangePickModeModify(): void;
        ChangePickModeClone(): void;
        ChangePickModeTerrain(): void;
        ChangePickModeRemove(): void;
        get PickMode(): PickMode;
        get OrbitControl(): THREE.OrbitControls;
        GetPickParents(): GameObject;
        private mouseEvent;
        private pickMode;
        private raycaster;
        private pickedObject;
        private pickedParent;
        private pickPositionX;
        private pickPositionY;
        private orbitControl;
        private pickedParentName;
    }
}
