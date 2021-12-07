var JWFramework;
(function (JWFramework) {
    class HeightmapTerrain extends JWFramework.GameObject {
        constructor(x, z) {
            super();
            this.heigtIndexBuffer = [];
            this.heigtBuffer = [];
            this.vertexNormalNeedUpdate = false;
            this.inSecter = false;
            this.cameraInSecter = false;
            this.width = x;
            this.height = z;
            //this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
            this.name = "Terrain";
            this.type = JWFramework.ObjectType.OBJ_TERRAIN;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
            this.CreateTerrainMesh();
        }
        InitializeAfterLoad() {
            this.PhysicsComponent.SetPostion(this.width, 0, this.height);
            this.CreateBoundingBox();
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }
        CreateBoundingBox() {
            this.CollisionComponent.CreateBoundingBox(300, 5000, 300);
            this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2500, this.height), new THREE.Vector3(300, 5000, 300));
        }
        CreateTerrainMesh() {
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
        get HeightIndexBuffer() {
            return this.heigtIndexBuffer;
        }
        get HeightBuffer() {
            this.heigtIndexBuffer.forEach(element => this.heigtBuffer.push(this.planeGeomatry.getAttribute('position').getY(element)));
            return this.heigtBuffer;
        }
        SetHeight(index) {
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            let height = this.planeGeomatry.getAttribute('position').getY(index);
            this.planeGeomatry.getAttribute('position').setY(index, height += 3);
            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            this.vertexNormalNeedUpdate = true;
        }
        CollisionActive(value) {
            if (value == JWFramework.ObjectType.OBJ_CAMERA) {
                this.cameraInSecter = true;
                this.material.opacity = 0.9;
                this.planeGeomatry.computeVertexNormals();
            }
            else
                this.inSecter = true;
        }
        CollisionDeActive(value) {
            if (value == JWFramework.ObjectType.OBJ_CAMERA) {
                this.cameraInSecter = false;
                this.material.opacity = 1;
            }
            else
                this.inSecter = false;
        }
        Animate() {
            if (JWFramework.SceneManager.getInstance().CurrentScene.Picker.PickMode != JWFramework.PickMode.PICK_TERRAIN && this.vertexNormalNeedUpdate) {
                //this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
        }
    }
    JWFramework.HeightmapTerrain = HeightmapTerrain;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=HeightmapTerrain.js.map