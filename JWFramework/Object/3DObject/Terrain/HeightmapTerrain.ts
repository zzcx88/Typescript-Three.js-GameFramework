namespace JWFramework {
    export class HeightmapTerrain extends GameObject {
        constructor(x: number, z: number) {
            super();
            this.width = x;
            this.height = z;
            //this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
            this.name = "Terrain";
            this.type = ObjectType.OBJ_TERRAIN;

            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);

            this.CreateTerrainMesh();
        }

        public InitializeAfterLoad() {
            this.PhysicsComponent.SetPostion(this.width, 0, this.height);

            this.CreateBoundingBox();

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            SceneManager.getInstance().SceneInstance.add(this.boxHelper);
            ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }

        public CreateBoundingBox() {
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(this.width, 2500, this.height), new THREE.Vector3(300, 5000, 300));
        }

        public CreateTerrainMesh() {
            this.planeGeomatry = new THREE.PlaneGeometry(300, 300, 32, 32);
            this.material = new THREE.MeshStandardMaterial();
            this.texture = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture.jpg");
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.repeat.set(128, 128);
            this.material.map = this.texture;
            this.material.wireframe = false;

            let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
            this.planeGeomatry.applyMatrix4(rotation);

            this.planeGeomatry.computeBoundingSphere();
            this.planeGeomatry.computeVertexNormals();

            this.planeMesh = new THREE.Mesh(this.planeGeomatry, this.material);
            this.planeMesh.receiveShadow = true;
            this.planeMesh.castShadow = true;

            this.gameObjectInstance = this.planeMesh;
            this.GameObjectInstance.name = this.name;

            this.InitializeAfterLoad();
        }

        public get HeightIndexBuffer(): number[] {
            return this.heigtIndexBuffer;
        }

        public get HeightBuffer(): number[] {
            this.heigtIndexBuffer.forEach(element =>
                this.heigtBuffer.push(this.planeGeomatry.getAttribute('position').getY(element)));
            return this.heigtBuffer;
        }

        public SetHeight(index: number) {
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            let height: number = this.planeGeomatry.getAttribute('position').getY(index);
            this.planeGeomatry.getAttribute('position').setY(index, height += 3);

            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            this.vertexNormalNeedUpdate = true;
            
        }

        public Animate() {
            if (SceneManager.getInstance().CurrentScene.Picker.GetPickParents() != undefined) {

                //이부분은 충돌 매니저에서 실행한다
                if (this.boxHelper.box.intersectsBox(SceneManager.getInstance().CurrentScene.Picker.GetPickParents().CollisionComponet.BoundingBox)) {
                    this.inSecter = true;
                    SceneManager.getInstance().CurrentScene.Picker.GetPickParents().CollisionComponet.terrain = this;
                }
                else
                    this.inSecter = false;
            }
            if (SceneManager.getInstance().CurrentScene.Picker.PickMode != PickMode.PICK_TERRAIN && this.vertexNormalNeedUpdate) {
                this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
        }

        private plane: THREE.Group;
        private planeMesh: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.MeshStandardMaterial;
        private texture: THREE.Texture;

        private boundingBox: THREE.Box3;
        private boxHelper: THREE.Box3Helper;

        private width: number;
        private height: number;

        private heigtIndexBuffer: number[] = [];
        private heigtBuffer: number[] = [];

        private vertexNormalNeedUpdate: boolean = false;

        public inSecter: boolean = false
    }
}