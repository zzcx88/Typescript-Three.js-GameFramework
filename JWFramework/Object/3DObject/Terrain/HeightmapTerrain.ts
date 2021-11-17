namespace JWFramework {
    export class HeightmapTerrain extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);

            this.heightmapImage = new Image();
            this.heightmapImage.src = "Model/Heightmap/Heightmap.png";

            this.name = "Terrain";
        }

        public InitializeAfterLoad() {
            this.GameObjectInstance = new THREE.Mesh();
            this.GameObjectInstance.matrixAutoUpdate = false;

            this.CreateTerrain();

            ObjectManager.getInstance().AddObject(this, this.name, this.Type);

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                this.guiComponent = new GUIComponent(this);
            }
        }

        public CreateTerrain() {
            let context = WorldManager.getInstance().Canvas.getContext("2d");
            //let imgData = context.getImageData(0, 0, WorldManager.getInstance().Canvas.width, WorldManager.getInstance().Canvas.height);
            
            this.planeGeomatry = new THREE.PlaneGeometry(300, 300, 10, 10);
            this.material = new THREE.MeshStandardMaterial();
            this.texture = new THREE.TextureLoader().load('Model/Heightmap/IslandHeightmap.png');
            this.material.displacementMap = this.texture;
            this.material.map = this.texture;
            this.material.displacementScale = 20;
            this.plane = new THREE.Mesh(this.planeGeomatry, this.material);
            this.gameObjectInstance = this.plane;
            this.plane.rotation.x = -90;
            this.GameObjectInstance.name = this.name;
            SceneManager.getInstance().SceneInstance.add(this.GameObjectInstance);
        }

        public GetHeight(positionX: number, positionZ: number): number {
            let positionAttribute = this.plane.geometry.getAttribute('position');
            let vertex = new THREE.Vector3();
            for (let i = 0; i < positionAttribute.array.length; ++i) {
                if (vertex.fromBufferAttribute(positionAttribute, i).x == positionX && vertex.fromBufferAttribute(positionAttribute, i).z == positionZ) {
                    console.log(this.plane.localToWorld(vertex).y);
                    return this.plane.localToWorld(vertex).y;
                }
            }
        }

        public Animate() {
            if (this.Picked == true) {
                if (InputManager.getInstance().GetKeyState('left')) {
                    this.PhysicsComponent.Rotate(0, 0, -1);
                }
                if (InputManager.getInstance().GetKeyState('right')) {
                    this.PhysicsComponent.Rotate(0, 0, 1);
                }
                if (InputManager.getInstance().GetKeyState('down')) {
                    this.PhysicsComponent.Rotate(-1, 0, 0);
                }
                if (InputManager.getInstance().GetKeyState('up')) {
                    this.PhysicsComponent.Rotate(1, 0, 0);
                }
                if (InputManager.getInstance().GetKeyState('w')) {
                    this.PhysicsComponent.MoveFoward(1);
                }
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == true) {
                this.guiComponent.ShowGUI(true);
                this.axisHelper.visible = true;
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == false) {
                this.guiComponent.ShowGUI(false);
                this.axisHelper.visible = false;
            }
        }

        private plane: THREE.Mesh;
        private planeGeomatry: THREE.PlaneGeometry;
        private material: THREE.MeshStandardMaterial;
        private texture: THREE.Texture;
        private heightmapImage: HTMLImageElement;
        private axisHelper: THREE.AxesHelper;
    }
}