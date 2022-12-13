var JWFramework;
(function (JWFramework) {
    class CollisionComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.orientedBoundingBoxInlcude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }
        CreateBoundingBox(x, y, z) {
            this.sizeAABB = new THREE.Vector3(x, y, z);
            this.boundingBox = new THREE.Box3();
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), this.sizeAABB);
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            if (JWFramework.SceneManager.getInstance().SceneInstance != null)
                JWFramework.SceneManager.getInstance().SceneInstance.add(this.boxHelper);
            this.boundingBoxInclude = true;
        }
        CreateOrientedBoundingBox(center, halfSize) {
            if (center == null)
                center = new THREE.Vector3(0, 0, 0);
            if (halfSize == null)
                halfSize = new THREE.Vector3(0, 0, 0);
            this.orientedBoundingBox = new THREE.OBB(center, halfSize, new THREE.Matrix3());
            let color = new THREE.Color().setColorName("Red");
            let obbGeometry = new THREE.BoxGeometry(center.x, center.y, center.z);
            let material = new THREE.MeshBasicMaterial({ color });
            material.wireframe = true;
            this.obbBoxHelper = new THREE.Mesh(obbGeometry, material);
            if (JWFramework.SceneManager.getInstance().SceneInstance != null)
                JWFramework.SceneManager.getInstance().SceneInstance.add(this.obbBoxHelper);
            this.orientedBoundingBoxInlcude = true;
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
        get OBB() {
            return this.orientedBoundingBox;
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
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), this.sizeAABB);
            }
            if (this.orientedBoundingBoxInlcude) {
                this.orientedBoundingBox.set(this.gameObject.PhysicsComponent.GetPosition(), this.orientedBoundingBox.halfSize, this.gameObject.GameObjectInstance.rotate);
            }
            if (this.raycasterInclude == true) {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
            }
        }
    }
    JWFramework.CollisionComponent = CollisionComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CollisionComponent.js.map