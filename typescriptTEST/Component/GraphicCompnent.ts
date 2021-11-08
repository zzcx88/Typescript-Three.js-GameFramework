namespace JWFramework {
    export class GraphComponent {
        constructor(gameObject: GameObject) {
            this.GameObject = gameObject;
            this.renderSwitch = true;
        }

        public SetRenderOnOff(renderSwitch: boolean) {
            this.renderSwitch = renderSwitch;

            if (renderSwitch == false) {
                SceneManager.getInstance().SceneInstance.remove(this.GameObject.GameObjectInstance);
            }
            else {
                if (SceneManager.getInstance().SceneInstance)
                SceneManager.getInstance().SceneInstance.add(this.GameObject.GameObjectInstance);
            }
        }

        private GameObject: GameObject;
        private renderSwitch: boolean;
    }
}