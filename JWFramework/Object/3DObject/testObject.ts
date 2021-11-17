namespace JWFramework {
    export class TestObject extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
        }

        public InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = false;
            this.PhysicsComponent.SetScaleScalar(0.1);
            this.PhysicsComponent.SetPostion(0, 0, -20);
            this.gameObjectInstance.rotation.x = 0;
            this.gameObjectInstance.rotation.y = 0;
            this.gameObjectInstance.rotation.z = 0;
            //this.PhysicsComponent.Rotate(0, 180, 0);

            this.GameObjectInstance.name = this.name;

            ObjectManager.getInstance().AddObject(this, this.name, this.Type);

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                this.guiComponent = new GUIComponent(this);
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

        private distance = 0;
        private axisHelper: THREE.AxesHelper;
    }
}