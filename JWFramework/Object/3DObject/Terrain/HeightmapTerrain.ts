namespace JWFramework {
    export class HeightmapTerrain extends GameObject {
        constructor() {
            super();
            this.name = "Terrain";
            this.CreateTerrainMesh();

            this.type = ObjectType.OBJ_TERRAIN;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);
        }

        public InitializeAfterLoad() {
            //for (let i = 0; i < this.planeGeomatry.getAttribute('position').array.length / 3; ++i)
            //    if (i % 2 == 0)
            //        this.planeGeomatry.getAttribute('position').setY(i, 10);

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }

        public CreateTerrainMesh() {
            this.planeGeomatry = new THREE.PlaneGeometry(3000, 3000, 640, 640);
            this.material = new THREE.MeshStandardMaterial();
            this.texture = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture.jpg");
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.repeat.set(300, 300);
            //this.material.displacementMap = this.texture;
            this.material.map = this.texture;
            //this.material.displacementScale = 50;
            this.material.wireframe = false;

            let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
            this.planeGeomatry.applyMatrix4(rotation);

            this.planeGeomatry.computeBoundingSphere();
            this.planeGeomatry.computeVertexNormals();

            this.planeGeomatry.attributes.position.array;

            this.planeMesh = new THREE.Mesh(this.planeGeomatry, this.material);

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
            //console.log(this.planeGeomatry.getAttribute('position').array.length);
            let height: number = this.planeGeomatry.getAttribute('position').getY(index);
            this.planeGeomatry.getAttribute('position').setY(index, height += 3);

            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            console.log(this.heigtIndexBuffer);
        }

        public Animate() {

        }
        private plane: THREE.Group;
        private planeMesh: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.MeshStandardMaterial;
        private texture: THREE.Texture;

        private heigtIndexBuffer: number[] = [];
        private heigtBuffer: number[] = [];

        private scaleY: number

        private heightmapImage: HTMLImageElement;

        private axisHelper: THREE.AxesHelper;
    }
}