namespace JWFramework {
    export class TestObject extends GameObject {
        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
        }

        public InitializeAfterLoad() {
            this.PhysicsComponent.SetScaleScalar(0.1);
            //this.PhysicsComponent.Rotate(0, 180, 0);

            this.GameObjectInstance.name = this.name;

            ObjectManager.getInstance().AddObject(this, this.name, this.Type);

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST) {
                this.guiComponent = new GUIComponent(this);
            }
        }

        public Animate() {
            if (this.Picked == true) {
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
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == true) {
                this.guiComponent.ShowGUI(true);
            }
            if (SceneManager.getInstance().SceneType == SceneType.SCENE_TEST && this.Picked == false) {
                this.guiComponent.ShowGUI(false);
            }
        }

        private y: number = 0;
    }
}