var JWFramework;
(function (JWFramework) {
    class GraphComponent {
        constructor(gameObject) {
            this.GameObject = gameObject;
            this.GameObject.GraphicCompIncluded = true;
            this.renderSwitch = true;
        }
        SetRenderOnOff(renderSwitch) {
            this.renderSwitch = renderSwitch;
            if (renderSwitch == false) {
                JWFramework.SceneManager.getInstance().SceneInstance.remove(this.GameObject.GameObjectInstance);
            }
            else {
                if (JWFramework.SceneManager.getInstance().SceneInstance)
                    JWFramework.SceneManager.getInstance().SceneInstance.add(this.GameObject.GameObjectInstance);
            }
        }
    }
    JWFramework.GraphComponent = GraphComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GraphicCompnent.js.map