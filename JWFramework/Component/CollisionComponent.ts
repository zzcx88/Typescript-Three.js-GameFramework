namespace JWFramework
{
    export class CollisionComponent
    {
        constructor(gameObject: GameObject)
        {
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.orientedBoundingBoxInlcude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }

        public CreateBoundingBox(x: number, y: number, z: number)
        {
            this.sizeAABB = new THREE.Vector3(x, y, z);
            this.boundingBox = new THREE.Box3();
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), this.sizeAABB);
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            if (SceneManager.getInstance().SceneInstance != null)
                SceneManager.getInstance().SceneInstance.add(this.boxHelper);

            this.boundingBoxInclude = true;
        }

        public CreateOrientedBoundingBox(center?: THREE.Vector3, halfSize?: THREE.Vector3)
        {
            if (center == null)
                center = new THREE.Vector3(0, 0, 0);
            if (halfSize == null)
                halfSize = new THREE.Vector3(1, 1, 1);
            this.orientedBoundingBox = new THREE.OBB();
            let color = new THREE.Color().setColorName("Red");
            let obbGeometry = new THREE.BoxGeometry(halfSize.x, halfSize.y, halfSize.z);
            obbGeometry.userData.obb = new THREE.OBB(center.clone(), halfSize.clone());
            let material = new THREE.MeshBasicMaterial({ color });
            material.wireframe = true;
            this.obbBoxHelper = new THREE.Mesh(obbGeometry, material);

            //this.gameObject.GameObjectInstance.add(this.obbBoxHelper);
            if (SceneManager.getInstance().SceneInstance != null)
                SceneManager.getInstance().SceneInstance.add(this.obbBoxHelper);

            this.orientedBoundingBoxInlcude = true;
        }

        public CreateBoundingSphere()
        {

        }

        public CreateRaycaster()
        {
            let vec3pos = new THREE.Vector3(0, 0, 0);
            let vecd3 = new THREE.Vector3(0, -1, 0);
            this.raycaster = new THREE.Raycaster(vec3pos, vecd3);

            this.raycasterInclude = true;
        }

        public get BoundingBox(): THREE.Box3
        {
            return this.boundingBox;
        }

        public get BoxHelper(): THREE.Box3Helper
        {
            return this.boxHelper;
        }

        public get OBB(): THREE.OBB {
            return this.orientedBoundingBox;
        }

        public get ObbBoxHelper(): THREE.Mesh
        {
            return this.obbBoxHelper;
        }

        public get BoundingSphere(): THREE.Sphere
        {
            return this.boundingSphere;
        }

        public get Raycaster(): THREE.Raycaster
        {
            return this.raycaster;
        }

        public DeleteCollider()
        {
            if (this.boundingBox)
            {
                this.boxHelper.visible = false;
                this.boxHelper.geometry.dispose();
                delete this.boundingBox;
                delete this.boxHelper;
                this.boundingBox = null;
                this.boxHelper = null;
            }
            if (this.orientedBoundingBox)
            {
                this.obbBoxHelper.visible = false;
                delete this.orientedBoundingBox;
                this.obbBoxHelper.geometry.dispose();
                delete this.obbBoxHelper.material;
                delete this.obbBoxHelper.geometry.userData.obb;
                delete this.obbBoxHelper;
                this.orientedBoundingBox = null;
                this.obbBoxHelper = null;

            }
            if (this.raycaster)
            {
                delete this.raycaster;
                this.raycaster = null;
            }
        }

        public Update()
        {
            if (this.boundingBox)
            {
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), this.sizeAABB);
            }
            if (this.orientedBoundingBox)
            {
                this.obbBoxHelper.scale.set(this.gameObject.PhysicsComponent.GetScale().x, this.gameObject.PhysicsComponent.GetScale().y, this.gameObject.PhysicsComponent.GetScale().z)
                this.obbBoxHelper.rotation.set(this.gameObject.PhysicsComponent.GetRotateEuler().x, this.gameObject.PhysicsComponent.GetRotateEuler().y, this.gameObject.PhysicsComponent.GetRotateEuler().z);
                this.obbBoxHelper.position.set(this.gameObject.PhysicsComponent.GetPosition().x, this.gameObject.PhysicsComponent.GetPosition().y, this.gameObject.PhysicsComponent.GetPosition().z);
                this.orientedBoundingBox.copy(this.obbBoxHelper.geometry.userData.obb);
                this.orientedBoundingBox.applyMatrix4(this.obbBoxHelper.matrixWorld);
            }
            if (this.raycaster)
            {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
            }
        }

        private sizeAABB: THREE.Vector3;

        private gameObject: GameObject;
        public terrain: HeightmapTerrain;

        //충돌체를 배열로 관리하도록 변경해야함
        private boundingBox: THREE.Box3 = null;
        private orientedBoundingBox: THREE.OBB = null;
        private boundingSphere: THREE.Sphere = null;
        private raycaster: THREE.Raycaster = null;

        private boundingBoxInclude: boolean;
        private orientedBoundingBoxInlcude: boolean;
        private boundingSphereInclude: boolean;
        private raycasterInclude: boolean;

        private boxHelper: THREE.Box3Helper;
        private obbBoxHelper: THREE.Mesh
    }
}