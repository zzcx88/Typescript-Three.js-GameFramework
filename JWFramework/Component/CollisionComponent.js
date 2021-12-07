var JWFramework;
(function (JWFramework) {
    class CollisionComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }
        CreateBoundingBox(x, y, z) {
            this.sizeX = x;
            this.sizeY = y;
            this.sizeZ = z;
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(this.sizeX, this.sizeY, this.sizeZ));
            this.boundingBoxInclude = true;
        }
        CreateBoundingSphere() {
        }
        CreateRaycaster() {
            let vec3pos = new THREE.Vector3(0, 0, 0);
            let vecd3 = new THREE.Vector3(0, -1, 0);
            this.raycaster = new THREE.Raycaster(vec3pos, vecd3);
            this.raycasterInclude = true;
        }
        get BoundingBox() {
            return this.boundingBox;
        }
        get BoxHelper() {
            return this.boxHelper;
        }
        get BoundingSphere() {
            return this.boundingSphere;
        }
        get Raycaster() {
            return this.raycaster;
        }
        DeleteCollider() {
            if (this.boundingBoxInclude) {
                this.boxHelper.visible = false;
                delete this.boundingBox;
                delete this.boxHelper;
                this.boundingBox = null;
                this.boxHelper = null;
            }
            if (this.raycasterInclude == true) {
                delete this.raycaster;
            }
        }
        Update() {
            if (this.boundingBoxInclude) {
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(this.sizeX, this.sizeY, this.sizeZ));
            }
            if (this.raycasterInclude == true) {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
            }
        }
    }
    JWFramework.CollisionComponent = CollisionComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CollisionComponent.js.map