namespace JWFramework {
    export class CollisionComponent {
        constructor(gameObject: GameObject) {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }
       
        public CreateBoundingBox() {
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));

            this.boundingBoxInclude = true;
        }

        public CreateBoundingSphere() {

        }

        public CreateRaycaster() {
            let vec3pos = new THREE.Vector3(0, 0, 0);
            let vecd3 = new THREE.Vector3(0, -1, 0);
            this.raycaster = new THREE.Raycaster(vec3pos, vecd3);

            this.raycasterInclude = true;
        }

        public get BoundingBox(): THREE.Box3 {
            return this.boundingBox;
        }

        public get BoundingSphere(): THREE.Sphere {
            return this.boundingSphere;
        }

        public get Raycaster(): THREE.Raycaster {
            return this.raycaster;
        }

        public Update() {
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
                            this.gameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y+1, intersect[0].point.z);
                }
            }
        }

        private gameObject: GameObject;
        public terrain: HeightmapTerrain;
        private boundingBox: THREE.Box3;
        private boundingSphere: THREE.Sphere;
        private raycaster: THREE.Raycaster;

        private boundingBoxInclude: boolean;
        private boundingSphereInclude: boolean;
        private raycasterInclude: boolean;

        private boxHelper: THREE.Box3Helper;
    }
}