var JWFramework;
(function (JWFramework) {
    class CollisionComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }
        CreateBoundingBox() {
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
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
        get BoundingSphere() {
            return this.boundingSphere;
        }
        get Raycaster() {
            return this.raycaster;
        }
        Update() {
            if (this.boundingBoxInclude) {
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(1, 1, 1));
            }
            if (this.raycasterInclude == true) {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
                //이 작업은 충돌 매니저에서 수행하게 한다.
                if (this.terrain != undefined) {
                    let intersect = this.raycaster.intersectObject(this.terrain.GameObjectInstance);
                    if (intersect[0] != undefined)
                        if (intersect[0].distance < 1 || this.gameObject.PhysicsComponent.GetPosition().y < 0)
                            this.gameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                }
            }
        }
    }
    JWFramework.CollisionComponent = CollisionComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CollisionComponent.js.map