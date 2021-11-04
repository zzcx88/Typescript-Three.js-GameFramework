namespace JWFramework{
    export class TestCube extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this)
            this.graphicComponent = new GraphComponent(this)

            //this.geometry = new THREE.BoxGeometry(1, 1, 1);
            //this.material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
            //this.mesh = new THREE.Mesh(this.geometry, this.material);
            //this.mesh = ModelLoadManager.getInstance().LoadModel('..\Model\DamagedHelmet.gltf');

            //let root: THREE.Group;
            //let loader: THREE.GLTFLoader = new THREE.GLTFLoader;
            //loader.load("Model/Flower.glb",
            //    (gltf) => {
            //        console.log('success')
            //        console.log(gltf)
            //        this.mesh = gltf.scene;
            //        this.GameObjectInstance = this.mesh;
            //        SceneManager.getInstance().SceneInstance.add(this.GameObjectInstance);
            //        this.physicsComponent.Rotate(0, 1.5, 0);
            //    },
            //    (progress) => {
            //        console.log('progress')
            //        console.log(progress)
            //    },
            //    (error) => {
            //        console.log('error')
            //        console.log(error)
            //    });

            ModelLoadManager.getInstance().LoadModel('Model/DamagedHelmet.gltf', this);
        }

        public get PhysicsComponent(): PhysicsComponent {
            return this.physicsComponent;
        }

        public get GraphComponent(): GraphComponent {
            return this.graphicComponent;
        }

        public Animate() {
            if (InputManager.getInstance().GetKeyState('left')) {
                this.y = 1;
                this.PhysicsComponent.Rotate(0, this.y, 0);
            }
            if (InputManager.getInstance().GetKeyState('right')) {
                this.y = -1;
                this.PhysicsComponent.Rotate(0, this.y, 0);
            }
            if (InputManager.getInstance().GetKeyState('up')) {
                this.PhysicsComponent.MoveFoward(1);
            }
                
        }

        private y: number = 0;
        private physicsComponent: PhysicsComponent;
        private graphicComponent: GraphComponent;
    }
}