declare namespace JWFramework {
    class ObjectManager {
        private static instance;
        constructor();
        static getInstance(): ObjectManager;
        GetObjectsFromType(): void;
        GetObjectFromName(name: string): GameObject;
        GetInSectorTerrain(): THREE.Group;
        get GetObjectList(): ObjectSet[][];
        ClearExportObjectList(): void;
        AddObject(gameObject: GameObject, name: string, type: ObjectType): void;
        MakeClone(selectObject: GameObject): GameObject;
        MakeJSONArray(): void;
        DeleteObject(gameObject: GameObject): void;
        DeleteAllObject(): void;
        private RenderOffObject;
        Animate(): void;
        Render(): void;
        private terrainList;
        private objectList;
        private exportObjectList;
    }
}
