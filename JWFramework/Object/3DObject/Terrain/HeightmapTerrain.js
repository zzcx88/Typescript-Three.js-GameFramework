var JWFramework;
(function (JWFramework) {
    class HeightmapTerrain extends JWFramework.GameObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.heightmapImage = new Image();
            this.heightmapImage.src = "Model/Heightmap/Heightmap.png";
            this.name = "Terrain";
        }
        InitializeAfterLoad() {
            this.GameObjectInstance = new THREE.Mesh();
            this.GameObjectInstance.matrixAutoUpdate = false;
            this.CreateTerrain();
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                this.guiComponent = new JWFramework.GUIComponent(this);
            }
        }
        CreateTerrain() {
            let context = JWFramework.WorldManager.getInstance().Canvas.getContext("2d");
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
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.GameObjectInstance);
        }
        GetHeight(positionX, positionZ) {
            let positionAttribute = this.plane.geometry.getAttribute('position');
            let vertex = new THREE.Vector3();
            for (let i = 0; i < positionAttribute.array.length; ++i) {
                if (vertex.fromBufferAttribute(positionAttribute, i).x == positionX && vertex.fromBufferAttribute(positionAttribute, i).z == positionZ) {
                    console.log(this.plane.localToWorld(vertex).y);
                    return this.plane.localToWorld(vertex).y;
                }
            }
        }
        Animate() {
            if (this.Picked == true) {
                if (JWFramework.InputManager.getInstance().GetKeyState('left')) {
                    this.PhysicsComponent.Rotate(0, 0, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right')) {
                    this.PhysicsComponent.Rotate(0, 0, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('down')) {
                    this.PhysicsComponent.Rotate(-1, 0, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up')) {
                    this.PhysicsComponent.Rotate(1, 0, 0);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('w')) {
                    this.PhysicsComponent.MoveFoward(1);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == true) {
                this.guiComponent.ShowGUI(true);
                this.axisHelper.visible = true;
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_TEST && this.Picked == false) {
                this.guiComponent.ShowGUI(false);
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.HeightmapTerrain = HeightmapTerrain;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=HeightmapTerrain.js.map