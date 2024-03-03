/// <reference path="../../GameObject.ts" />
namespace JWFramework {
    export class HeightmapTerrain extends GameObject
    {
        constructor(x: number, z: number, segmentWidth: number, segmentHeight: number, planSize: number = 900, isDummy: boolean = false)
        {
            super();
            this.isDummy = isDummy;
            this.width = x;
            this.height = z;
            this.planSize = planSize;
            this.segmentWidth = segmentWidth;
            this.segmentHeight = segmentHeight;
            this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
            this.terrainIndex = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
            this.type = ObjectType.OBJ_TERRAIN;


            this.isClone = true;

            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);
            this.collisionComponent = new CollisionComponent(this);

            this.CreateTerrainMesh();
        }

        public InitializeAfterLoad() {
            this.PhysicsComponent.SetPostion(this.width, 0, this.height);

            if (this.isDummy == false)
            {
                this.CreateBoundingBox();
            }
            this.GameObjectInstance.matrixAutoUpdate = false;
            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            //SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
            ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }

        public CreateBoundingBox() 
        {
            this.CollisionComponent.CreateBoundingBox(this.planSize, 5000, this.planSize);
            this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2000, this.height), new THREE.Vector3(this.planSize, 5000, this.planSize));
            this.CollisionComponent.BoxHelper.visible = false;
            this.CollisionComponent.BoxHelper.matrixAutoUpdate = false;
        }

        private CreateTerrainMesh()
        {
            if (this.isDummy == false)
                this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, this.segmentWidth, this.segmentHeight);
            else
                this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);

            let customUniforms = {
                farmTexture: { type: "t", value: ShaderManager.getInstance().farmTexture },
                mountainTexture: { type: "t", value: ShaderManager.getInstance().mountainTexture },
                factoryTexture: { type: "t", value: ShaderManager.getInstance().factoryTexture },
                cityTexture: { type: "t", value: ShaderManager.getInstance().cityTexture },
                desertTexture: { type: "t", value: ShaderManager.getInstance().desertTexture },

                cityUVFactor: { type: "f", value: this.cityUVFactor },
                fogColor: { type: "c", value: THREE.UniformsLib['fog'].fogColor },
                fogDensity: { type: "f", value: THREE.UniformsLib['fog'].fogDensity },
                fogFar: { type: "f", value: THREE.UniformsLib['fog'].fogFar },
                fogNear: { type: "f", value: THREE.UniformsLib['fog'].fogNear },
                opacity: { type: "f", value: this.opacity }
            };
            
            // create custom material from the shader code above
            //   that is within specially labelled script tags
            this.material = new THREE.ShaderMaterial(
                {
                    uniforms: customUniforms,
                    vertexShader: ShaderManager.getInstance().SplattingShader.vertexShader.slice(),
                    fragmentShader: ShaderManager.getInstance().SplattingShader.fragmentShader.slice(),
                    //wireframe: true,
                    //side: THREE.DoubleSide,
                    fog: true,
                    transparent: false,
                });

            //this.material.map = this.texture;
            // this.gradientmap = new THREE.TextureLoader().load('Model/Heightmap/fiveTone.jpg');
            // this.gradientmap.minFilter = THREE.NearestFilter;
            // this.gradientmap.magFilter = THREE.NearestFilter;
            // this.material.gradientMap = this.gradientmap;

            //this.material.normalMap = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture_N.png");
            //this.material.wireframe = true;

            let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
            this.planeGeomatry.applyMatrix4(rotation);

            this.planeGeomatry.computeBoundingSphere();
            this.planeGeomatry.computeVertexNormals();

            this.planeMesh = new THREE.Mesh(this.planeGeomatry, this.material);
            this.planeMesh.receiveShadow = true;
            this.planeMesh.castShadow = true;

            this.gameObjectInstance = this.planeMesh;
            this.GameObjectInstance.name = this.name;

            this.gameObjectInstance.frustumCulled = true;

            this.InitializeAfterLoad();
        }

        public get HeightIndexBuffer(): number[] {
            return this.heigtIndexBuffer;
        }

        public get HeightBuffer(): number[] {
            for (let i = 0; i < this.heigtBuffer.length; ++i) {
                this.heigtBuffer.pop();
            }
            this.heigtBuffer.length = 0;
            this.heigtIndexBuffer.forEach(element =>
                this.heigtBuffer.push(this.planeGeomatry.getAttribute('position').getY(element)));
            return this.heigtBuffer;
        }

        public get IsDummy()
        {
            return this.isDummy;
        }

        public set IsDummy(flag: boolean)
        {
            this.isDummy = flag;
        }

        public SetHeight(index: number, value: number = undefined, option: TerrainOption = TerrainOption.TERRAIN_UP)
        {
            if (this.isDummy == true)
            {
                if (this.collisionComponent.BoundingBox != null)
                {
                    this.collisionComponent.DeleteCollider();
                    this.planeGeomatry.dispose();
                    this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                    this.planeMesh.geometry = this.planeGeomatry;
                    let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                    this.planeGeomatry.applyMatrix4(rotation);
                    //this.material.wireframe = true;
                }
            }
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            let height: number = this.planeGeomatry.getAttribute('position').getY(index);

            if (value != undefined && option == TerrainOption.TERRAIN_UP) {
                value = Math.abs(value);
            }

            if (option == TerrainOption.TERRAIN_DOWN) {
                value = Math.abs(value);
                value *= -1;
                this.planeGeomatry.getAttribute('position').setY(index, height += value);
            }
            else if (option == TerrainOption.TERRAIN_BALANCE || option == TerrainOption.TERRAIN_LOAD) {
                this.planeGeomatry.getAttribute('position').setY(index, value);
            }
            else {
                this.planeGeomatry.getAttribute('position').setY(index, height += value);
            }
            if (this.isDummy == false) {
                let objectList = ObjectManager.getInstance().GetObjectList;
                let endPointIndex = this.planeGeomatry.getAttribute('position').count - 1;
                let oldheight: number = this.planeGeomatry.getAttribute('position').getY(index);

                if (this.planeGeomatry.getAttribute('position').getX(index) == this.planSize / 2) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index - this.segmentHeight, oldheight);

                        if (index == endPointIndex) {
                            if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)]) {
                                let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)].GameObject;
                                (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                                (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(0, oldheight);
                            }
                        }

                        else if (index == this.segmentWidth) {
                            if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)]) {
                                let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)].GameObject;
                                (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                                (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(endPointIndex - this.segmentWidth, oldheight);
                            }
                        }
                    }
                }

                if (this.planeGeomatry.getAttribute('position').getX(index) == -(this.planSize / 2)) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index + this.segmentHeight, oldheight);
                    }

                    if (index == 0) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)]) {
                            let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(endPointIndex, oldheight);
                        }
                    }

                    else if (index == endPointIndex - this.segmentWidth) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)]) {
                            let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(this.segmentWidth, oldheight);
                        }
                    }
                }

                if (this.planeGeomatry.getAttribute('position').getZ(index) == this.planSize / 2) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index - (endPointIndex - this.segmentWidth), oldheight);
                    }
                }

                if (this.planeGeomatry.getAttribute('position').getZ(index) == -(this.planSize / 2)) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index + (endPointIndex - this.segmentWidth), oldheight);
                    }
                }
            }

            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            this.vertexNormalNeedUpdate = true;

            let positionLength = this.planeGeomatry.getAttribute('position').count;
            let cnt = 0;
            for (let i = 0; i < positionLength; ++i)
            {
                if (this.planeGeomatry.getAttribute('position').getY(i) <= -3)
                {
                    this.useDirtTexture = true;
                }
                else if (i == positionLength - 1 && !this.useDirtTexture)
                    this.useDirtTexture = false

                if (this.planeGeomatry.getAttribute('position').getY(i) == 1)
                    ++cnt;
                if (cnt >= 30 && this.physicsComponent.GetMaxVertex().y <= 110)
                {
                    this.useCityTexture = true;
                    this.material.uniforms.cityUVFactor.value = 6;
                }
                else
                {
                    this.useCityTexture = false;
                    this.material.uniforms.cityUVFactor.value = 1;
                }
            }

        }

        public CollisionActive(object: GameObject)
        {
            if (this.isDummy == false)
            {
                if (object.Type == ObjectType.OBJ_CAMERA)
                {
                    this.cameraInSecter = false;
                    // this.material.opacity = 1;
                }
                else
                {
                    if (this.inSectorObject.includes(object) == false)
                    {
                        this.inSectorObject.push(object);
                        //this.opacity = 0.5;
                        //this.material.uniforms['opacity'].value = this.opacity;
                        this.inSecter = true;
                    }
                }
            }
        }

        public CollisionDeActive(object: GameObject) {
            if (object.Type == ObjectType.OBJ_CAMERA) {
                this.cameraInSecter = false;
            }
            else {
                if (this.inSectorObject.includes(object) == true) {
                    this.inSectorObject = this.inSectorObject.filter((element) => (element != object)).slice();
                }
            }
        }

        public Animate()
        {
            if (this.isDummy == true)
            {
                if (this.collisionComponent.BoundingBox != null)
                {
                    this.collisionComponent.DeleteCollider(); 
                    this.planeGeomatry.dispose();
                    this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                    this.planeMesh.geometry = this.planeGeomatry;
                    let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                    this.planeGeomatry.applyMatrix4(rotation);
                    //this.material.wireframe = true;
                }
            }
            else
            {
                if (this.useDirtTexture)
                    this.material.uniforms.factoryTexture.value = ShaderManager.getInstance().desertTexture;
                else
                    this.material.uniforms.factoryTexture.value = ShaderManager.getInstance().factoryTexture;
                if (this.useCityTexture)
                    this.material.uniforms.cityTexture.value = ShaderManager.getInstance().cityTexture;
                else
                    this.material.uniforms.cityTexture.value = ShaderManager.getInstance().farmTexture;
                if (this.collisionComponent.BoundingBox == null)
                    this.CreateBoundingBox();
            }

            if (/*SceneManager.getInstance().CurrentScene.Picker.PickMode != PickMode.PICK_TERRAIN &&*/ this.vertexNormalNeedUpdate) {
                this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
            this.inSectorObject = this.inSectorObject.filter((element) => (element.IsDead == false));
            if (this.inSectorObject.length == 0) {
                //this.opacity = 1;
                //this.material.uniforms['opacity'].value = this.opacity;
                this.inSecter = false;
            }

            let cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
            if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
                WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
            if (cameraPosition.sub(this.physicsComponent.GetPosition()).length() > 4500)
            {
                this.GameObjectInstance.visible = false;
            }
            else
            {
                this.GameObjectInstance.visible = true;
            }

        }

        private planeMesh: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.ShaderMaterial;

        private terrainIndex: number;
        private width: number;
        private height: number;
        private segmentWidth: number;
        private segmentHeight: number;

        private heigtIndexBuffer: number[] = [];
        private heigtBuffer: number[] = [];
        public inSectorObject: GameObject[] = [];

        private vertexNormalNeedUpdate: boolean = false;
        private opacity: number = 1;
        private cityUVFactor: number = 1;

        public row: number = 0;
        public col: number = 0;
        private isDummy = false;
        private planSize: number;
        public inSecter: boolean = false
        public cameraInSecter: boolean = false;
        private useDirtTexture: boolean = false;
        private useCityTexture: boolean = false;
    }
}
