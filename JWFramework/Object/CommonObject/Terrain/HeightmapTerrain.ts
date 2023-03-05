﻿/// <reference path="../../GameObject.ts" />
namespace JWFramework {
    export class HeightmapTerrain extends GameObject {
        constructor(x: number, z: number, segmentWidth: number, segmentHeight: number) {
            super();
            this.width = x;
            this.height = z;
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

            this.CreateBoundingBox();

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
            ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }

        public CreateBoundingBox() {
            this.CollisionComponent.CreateBoundingBox(900, 5000, 900);
            this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2000, this.height), new THREE.Vector3(900, 5000, 900));
        }

        public CreateTerrainMesh() {
            this.planeGeomatry = new THREE.PlaneGeometry(900, 900, this.segmentWidth, this.segmentHeight);
            //this.material = new THREE.MeshStandardMaterial();

            let customUniforms = {
                farmTexture: { type: "t", value: ShaderManager.getInstance().farmTexture },
                mountainTexture: { type: "t", value: ShaderManager.getInstance().mountainTexture },
                factoryTexture: { type: "t", value: ShaderManager.getInstance().factoryTexture },

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
                    //side: THREE.DoubleSide,
                    fog: true,
                    transparent: true,
                });

            //this.material.map = this.texture;
            // this.gradientmap = new THREE.TextureLoader().load('Model/Heightmap/fiveTone.jpg');
            // this.gradientmap.minFilter = THREE.NearestFilter;
            // this.gradientmap.magFilter = THREE.NearestFilter;
            // this.material.gradientMap = this.gradientmap;

            //this.material.normalMap = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture_N.png");
            //this.material.wireframe = false;

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

        public SetHeight(index: number, value: number = undefined, option: TerrainOption = TerrainOption.TERRAIN_UP) {
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            let height: number = this.planeGeomatry.getAttribute('position').getY(index);

            //////////////////////

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

            //   this.planeGeomatry.getAttribute('position').setY(index, value);
            //////////////////////

            let objectList = ObjectManager.getInstance().GetObjectList;
            let endPointIndex = this.planeGeomatry.getAttribute('position').count - 1;
            let oldheight: number = this.planeGeomatry.getAttribute('position').getY(index);

            if (this.planeGeomatry.getAttribute('position').getX(index) == 900 / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1]) {
                    let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index - this.segmentHeight, oldheight);

                    if (index == endPointIndex) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 11]) {
                            let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 11].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(0, oldheight);
                        }
                    }

                    else if (index == this.segmentWidth) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 9]) {
                            let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 9].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(endPointIndex - this.segmentWidth, oldheight);
                        }
                    }
                }
            }

            if (this.planeGeomatry.getAttribute('position').getX(index) == -(900 / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1]) {
                    let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index + this.segmentHeight, oldheight);
                }

                if (index == 0) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 11]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 11].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(endPointIndex, oldheight);
                    }
                }

                else if (index == endPointIndex - this.segmentWidth) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 9]) {
                        let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 9].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(this.segmentWidth, oldheight);
                    }
                }
            }

            if (this.planeGeomatry.getAttribute('position').getZ(index) == 900 / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 10]) {
                    let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 10].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index - (endPointIndex - this.segmentWidth), oldheight);
                }
            }

            if (this.planeGeomatry.getAttribute('position').getZ(index) == -(900 / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 10]) {
                    let terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 10].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').setY(index + (endPointIndex - this.segmentWidth), oldheight);
                }
            }


            //로컬좌표
            //console.log(this.planeGeomatry.getAttribute('position').getX(index));


            //월드좌표
            //let vertex = new THREE.Vector3();
            //vertex.fromBufferAttribute(this.planeGeomatry.getAttribute('color'), index);
            //console.log(this.planeMesh.localToWorld(vertex));

            //for (let i = 33; i < 66; ++i) {
            //    console.log(i);
            //    this.planeGeomatry.getAttribute('position').needsUpdate = true;
            //    let height: number = this.planeGeomatry.getAttribute('position').getY(i);
            //    this.planeGeomatry.getAttribute('position').setY(i, height += 20);
            //} 

            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            this.vertexNormalNeedUpdate = true;

        }

        public CollisionActive(object: GameObject) {
            if (object.Type == ObjectType.OBJ_CAMERA) {
                this.cameraInSecter = false;
                // this.material.opacity = 1;
            }
            else {
                if (this.inSectorObject.includes(object) == false) {
                    this.inSectorObject.push(object);
                    this.opacity = 0.5;
                    this.material.uniforms['opacity'].value = this.opacity;
                    this.inSecter = true;
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

        public Animate() {
            if (/*SceneManager.getInstance().CurrentScene.Picker.PickMode != PickMode.PICK_TERRAIN &&*/ this.vertexNormalNeedUpdate) {
                this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
            this.inSectorObject = this.inSectorObject.filter((element) => (element.IsDead == false));
            if (this.inSectorObject.length == 0) {
                this.opacity = 1;
                this.material.uniforms['opacity'].value = this.opacity;
                this.inSecter = false;
            }
        }

        private planeMesh: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.ShaderMaterial;
        private farmTexture: THREE.Texture;
        private mountainTexture: THREE.Texture;
        private factoryTexture: THREE.Texture;
        private cityTexture: THREE.Texture;
        private gradientmap: THREE.Texture;

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

        public inSecter: boolean = false
        public cameraInSecter: boolean = false;
    }
}
