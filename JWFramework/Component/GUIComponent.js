var JWFramework;
(function (JWFramework) {
    class GUIComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
            //게임오브젝트의 GUI컴포넌트 외 다른 컴포넌트가 감지되면 해당 컴포넌트에 해당하는 GUI클래스를 등록
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