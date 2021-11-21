//var heightmapImage: HTMLImageElement;
//var size: number;
//var data: Float32Array;
//var canvas: HTMLCanvasElement;
//var context: CanvasRenderingContext2D;
//var imageData;

namespace JWFramework {
    export class HeightmapTerrain extends GameObject {
        constructor(width: number, height: number) {
            super();
            this.width = width;
            this.height = height;
            this.CreateTerrainMesh();

            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
        }

        public InitializeAfterLoad() {
            this.name = "Terrain";
            this.GameObjectInstance.name = this.name;
            this.scaleY = 100;
            this.GameObjectInstance.scale.y = this.scaleY;
            this.GameObjectInstance.position.x = this.width / 2;
            this.GameObjectInstance.position.z = this.height / 2;
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);

            //if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST) {
            //    this.axisHelper = new THREE.AxesHelper(10);
            //    this.GameObjectInstance.add(this.axisHelper);
            //    this.guiComponent = new GUIComponent(this);
            //}
        }

        static FromImage() {
            return new Promise(function (resolve, reject) {
            let heightmapImage = new Image();
            heightmapImage.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = heightmapImage.width;
                canvas.height = heightmapImage.height;
                let context = canvas.getContext('2d');
                let size = heightmapImage.width * heightmapImage.height;
                context.drawImage(heightmapImage, 0, 0);
                let pixels = context.getImageData(0, 0, heightmapImage.width, heightmapImage.height).data;
                let terrain = new HeightmapTerrain(heightmapImage.width, heightmapImage.height);
                for (let i = 0; i < size; i++) {
                    terrain.array[i * 3 + 1] = pixels[i * 4] / 256;
                }
                resolve(terrain);
            };
            heightmapImage.onabort = reject;
            heightmapImage.onerror = reject;
            heightmapImage.src = "Model/Heightmap/IslandHeightmap.png";
        });
    }

        public CreateTerrainMesh() {
            //this.planeGeomatry = new THREE.PlaneGeometry(300, 300, 30, 30);
            //this.material = new THREE.MeshStandardMaterial();
            //this.texture = new THREE.TextureLoader().load(this.heightmapImage.src);
            //this.material.displacementMap = this.texture;
            //this.material.map = this.texture;
            //this.material.displacementScale = 50;
            //this.plane = new THREE.Mesh(this.planeGeomatry, this.material);
            //this.gameObjectInstance = this.plane;
            //this.plane.rotation.x = -90;
            //this.GameObjectInstance.name = this.name;
            this.planeGeomatry = new THREE.PlaneGeometry(
                this.width,
                this.height,
                this.width - 1,
                this.height - 1
            );
            let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
            this.planeGeomatry.applyMatrix4(rotation);
            this.array = this.planeGeomatry.getAttribute("position").array;

            this.planeGeomatry.computeBoundingSphere();
            this.planeGeomatry.computeVertexNormals();

            this.texture = new THREE.TextureLoader().load("Model/Heightmap/IslandHeightmap.png");
            this.material = new THREE.MeshStandardMaterial();
            this.material.map = this.texture;

            this.planeMesh = new THREE.Mesh(this.planeGeomatry, this.material)

            //픽킹을 위해 그룹으로 감싼다.
            this.plane = new THREE.Group();
            this.plane.add(this.planeMesh);
            this.GameObjectInstance = this.plane;

            SceneManager.getInstance().SceneInstance.add(this.GameObjectInstance);

            this.InitializeAfterLoad();
        }


        public GetHeight(positionX: number, positionZ: number): number {
            let width = this.width;
            let height = this.height;
            //if (positionX < 0 || positionX >= width || positionZ < 0 || positionZ >= height) {
            //    throw new Error('point outside of terrain boundary');
            //}
            // Get integer floor of x, z
            let ix = Math.floor(positionX);
            let iz = Math.floor(positionZ);
            // Get real (fractional) component of x, z
            // This is the amount of each into the cell
            let rx = positionX - ix;
            let rz = positionZ - iz;
            // Edges of cell
            let a = this.array[(iz * width + ix) * 3 + 1];
            let b = this.array[(iz * width + (ix + 1)) * 3 + 1];
            let c = this.array[((iz + 1) * width + (ix + 1)) * 3 + 1];
            let d = this.array[((iz + 1) * width + ix) * 3 + 1];
            // Interpolate top edge (left and right)
            let e = (a * (1 - rx) + b * rx);
            // Interpolate bottom edge (left and right)
            let f = (c * rx + d * (1 - rx));
            // Interpolate between top and bottom
            let y = (e * (1 - rz) + f * rz);
            return (y * this.scaleY);
        }

        public Animate() {
            //if (this.Picked == true) {
            //    if (InputManager.getInstance().GetKeyState('left')) {
            //        this.PhysicsComponent.Rotate(0, 0, -1);
            //    }
            //    if (InputManager.getInstance().GetKeyState('right')) {
            //        this.PhysicsComponent.Rotate(0, 0, 1);
            //    }
            //    if (InputManager.getInstance().GetKeyState('down')) {
            //        this.PhysicsComponent.Rotate(-1, 0, 0);
            //    }
            //    if (InputManager.getInstance().GetKeyState('up')) {
            //        this.PhysicsComponent.Rotate(1, 0, 0);
            //    }
            //    if (InputManager.getInstance().GetKeyState('w')) {
            //        this.PhysicsComponent.MoveFoward(1);
            //    }
            //}
            //if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == true) {
            //    this.guiComponent.ShowGUI(true);
            //    this.axisHelper.visible = true;
            //}
            //if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == false) {
            //    this.guiComponent.ShowGUI(false);
            //    this.axisHelper.visible = false;
            //}
        }

        public width: number;
        public height: number;

        private plane: THREE.Group;
        private planeMesh: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.MeshStandardMaterial;
        private texture: THREE.Texture;

        private scaleY: number

        private array;

        private heightmapImage: HTMLImageElement;

        private axisHelper: THREE.AxesHelper;
    }
}