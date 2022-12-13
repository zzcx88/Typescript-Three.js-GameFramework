var JWFramework;
(function (JWFramework) {
    class GUIComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
            if (this.gameObject.PhysicsCompIncluded) {
            }
            if (this.gameObject.GraphicCompIncluded) {
            }
        }
        UpdateDisplay() {
            if (this.gameObject.PhysicsCompIncluded) {
            }
            if (this.gameObject.GraphicCompIncluded) {
            }
        }
        ShowGUI(show) {
        }
    }
    JWFramework.GUIComponent = GUIComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUIComponent.js.map