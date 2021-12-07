namespace JWFramework {
    export class CollisionComponent {
        constructor(gameObject: GameObject) {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }

        public CreateBoundingBox(x: number, y: number, z: number) {
            this.sizeX = x; this.sizeY = y; this.sizeZ = z;
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(this.sizeX, this.sizeY, this.sizeZ));

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

        public get BoxHelper(): THREE.Box3Helper {
            return this.boxHelper;
        }

        public get BoundingSphere(): THREE.Sphere {
            return this.boundingSphere;
        }

        public get Raycaster(): THREE.Raycaster {
            return this.raycaster;
        }

        public DeleteCollider() {
            if (this.boundingBoxInclude) {
                this.boxHelper.visible = false;
                delete this.boundingBox;
                delete this.boxHelper;
                this.boundingBox = null;
                this.boxHelper = null;
            }
            if (this.raycasterInclude == true) { 
                delete this.raycaster
            }
        }

        public Update() {
            if (this.boundingBoxInclude) {
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(this.sizeX, this.sizeY, this.sizeZ));
            }
            if (this.raycasterInclude == true) {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
            }
        }

        private sizeX: number;
        private sizeY: number;
        private sizeZ: number;

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