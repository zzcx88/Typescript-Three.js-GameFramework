var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var JWFramework;
(function (JWFramework) {
    var GUI_SRT = /** @class */ (function (_super) {
        __extends(GUI_SRT, _super);
        function GUI_SRT(gameObject) {
            var _this = _super.call(this) || this;
            _this.datGui = new dat.GUI;
            _this.gameObject = gameObject;
            _this.CreateFolder();
            _this.AddElement();
            return _this;
        }
        GUI_SRT.prototype.CreateFolder = function () {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
        };
        GUI_SRT.prototype.AddElement = function () {
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'x', -10, 10).step(0.01).listen();
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'y', -10, 10).step(0.01).listen();
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'z', -10, 10).step(0.01).listen();
            this.positionFolder.open();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'x', 0, Math.PI * 2).listen();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'y', 0, Math.PI * 2).listen();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'z', 0, Math.PI * 2).listen();
            this.rotateFolder.open();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'x', 0, 10).step(0.01).listen();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'y', 0, 10).step(0.01).listen();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'z', 0, 10).step(0.01).listen();
            this.scaleFolder.open();
        };
        GUI_SRT.prototype.UpdateDisplay = function () {
            this.datGui.updateDisplay();
        };
        GUI_SRT.prototype.ShowGUI = function (show) {
            this.datGui.closed = show;
        };
        return GUI_SRT;
    }(JWFramework.GUI_Base));
    JWFramework.GUI_SRT = GUI_SRT;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUI_SRT.js.map