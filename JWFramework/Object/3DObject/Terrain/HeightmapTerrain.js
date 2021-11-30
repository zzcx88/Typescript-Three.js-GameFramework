var JWFramework;
(function (JWFramework) {
    class HeightmapTerrain extends JWFramework.GameObject {
        constructor() {
            super();
            this.heigtIndexBuffer = [];
            this.heigtBuffer = [];
            this.name = "Terrain";
            this.CreateTerrainMesh();
            this.type = JWFramework.ObjectType.OBJ_TERRAIN;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
        }
        InitializeAfterLoad() {
            //for (let i = 0; i < this.planeGeomatry.getAttribute('position').array.length / 3; ++i)
            //    if (i % 2 == 0)
            //        this.planeGeomatry.getAttribute('position').setY(i, 10);
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }
        CreateTerrainMesh() {
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
        get HeightIndexBuffer() {
            return this.heigtIndexBuffer;
        }
        get HeightBuffer() {
            this.heigtIndexBuffer.forEach(element => this.heigtBuffer.push(this.planeGeomatry.getAttribute('position').getY(element)));
            return this.heigtBuffer;
        }
        SetHeight(index) {
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            //console.log(this.planeGeomatry.getAttribute('position').array.length);
            let height = this.planeGeomatry.getAttribute('position').getY(index);
            this.planeGeomatry.getAttribute('position').setY(index, height += 3);
            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            console.log(this.heigtIndexBuffer);
        }
        Animate() {
        }
    }
    JWFramework.HeightmapTerrain = HeightmapTerrain;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=HeightmapTerrain.js.map