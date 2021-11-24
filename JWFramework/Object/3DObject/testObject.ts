namespace JWFramework {
    export class TestObject extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
        }

        public InitializeAfterLoad() {
            //클론은 게임오브젝트 인스턴스를 하고 씬에 add한다.
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(0.5);
            this.PhysicsComponent.SetPostion(0, 20, 0);
            this.GameObjectInstance.rotation.x = 0;
            this.GameObjectInstance.rotation.y = 0;
            this.GameObjectInstance.rotation.z = 0;

            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST) {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
                //this.guiComponent = new GUIComponent(this);
            }
        }

        public Animate() {
            //if (this.name == "F-16")
            //    this.Picked = true;
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
                    this.PhysicsComponent.MoveFoward(50);
                }
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == true) {
                //this.GUIComponent.ShowGUI(true);
                
                this.axisHelper.visible = true;
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == false) {
                //this.GUIComponent.ShowGUI(false);
                this.axisHelper.visible = false;
            }
        }

        private distance = 0;
        private axisHelper: THREE.AxesHelper;
    }
}