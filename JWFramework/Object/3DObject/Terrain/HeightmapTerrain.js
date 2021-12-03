var JWFramework;
(function (JWFramework) {
    class HeightmapTerrain extends JWFramework.GameObject {
        constructor(x, z) {
            super();
            this.heigtIndexBuffer = [];
            this.heigtBuffer = [];
            this.vertexNormalNeedUpdate = false;
            this.inSecter = false;
            this.width = x;
            this.height = z;
            //this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
            this.name = "Terrain";
            this.type = JWFramework.ObjectType.OBJ_TERRAIN;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.CreateTerrainMesh();
        }
        InitializeAfterLoad() {
            this.PhysicsComponent.SetPostion(this.width, 0, this.height);
            this.CreateBoundingBox();
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.boxHelper);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }
        CreateBoundingBox() {
            this.boundingBox = new THREE.Box3();
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(this.width, 2500, this.height), new THREE.Vector3(300, 5000, 300));
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
        Animate() {
            if (JWFramework.SceneManager.getInstance().CurrentScene.Picker.GetPickParents() != undefined) {
                //이부분은 충돌 매니저에서 실행한다
                if (this.boxHelper.box.intersectsBox(JWFramework.SceneManager.getInstance().CurrentScene.Picker.GetPickParents().CollisionComponet.BoundingBox)) {
                    this.inSecter = true;
                    JWFramework.SceneManager.getInstance().CurrentScene.Picker.GetPickParents().CollisionComponet.terrain = this;
                }
                else
                    this.inSecter = false;
            }
            if (JWFramework.SceneManager.getInstance().CurrentScene.Picker.PickMode != JWFramework.PickMode.PICK_TERRAIN && this.vertexNormalNeedUpdate) {
                this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
        }
    }
    JWFramework.HeightmapTerrain = HeightmapTerrain;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=HeightmapTerrain.js.map