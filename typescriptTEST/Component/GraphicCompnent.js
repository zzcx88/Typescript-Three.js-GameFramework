var JWFramework;
(function (JWFramework) {
    var GraphComponent = /** @class */ (function () {
        function GraphComponent(gameObject) {
            this.GameObject = gameObject;
            this.renderSwitch = true;
        }
        GraphComponent.prototype.SetRenderOnOff = function (renderSwitch) {
            this.renderSwitch = renderSwitch;
            if (renderSwitch == false) {
                JWFramework.SceneManager.getInstance().SceneInstance.remove(this.GameObject.GameObjectInstance);
            }
            else {
                if (JWFramework.SceneManager.getInstance().SceneInstance)
                    JWFramework.SceneManager.getInstance().SceneInstance.add(this.GameObject.GameObjectInstance);
            }
        };
        return GraphComponent;
    }());
    JWFramework.GraphComponent = GraphComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GraphicCompnent.js.map