declare namespace JWFramework {
    class CollisionComponent {
        constructor(gameObject: GameObject);
        CreateBoundingBox(x: number, y: number, z: number): void;
        CreateOrientedBoundingBox(center?: THREE.Vector3, halfSize?: THREE.Vector3): void;
        CreateBoundingSphere(): void;
        CreateRaycaster(): void;
        get BoundingBox(): THREE.Box3;
        get BoxHelper(): THREE.Box3Helper;
        get OBB(): THREE.OBB;
        get BoundingSphere(): THREE.Sphere;
        get Raycaster(): THREE.Raycaster;
        DeleteCollider(): void;
        Update(): void;
        private sizeAABB;
        private gameObject;
        terrain: HeightmapTerrain;
        private boundingBox;
        private orientedBoundingBox;
        private boundingSphere;
        private raycaster;
        private boundingBoxInclude;
        private orientedBoundingBoxInlcude;
        private boundingSphereInclude;
        private raycasterInclude;
        private boxHelper;
        private obbBoxHelper;
    }
}
