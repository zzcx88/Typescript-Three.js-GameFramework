var JWFramework;
(function (JWFramework) {
    class GUI_SRT extends JWFramework.GUI_Base {
        constructor(gameObject) {
            super();
            this.datGui = new dat.GUI;
            this.datGui.open();
            this.gameObject = gameObject;
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
        }
        CreateFolder() {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
            this.isPlayerFolder = this.datGui.addFolder('IsPlayer');
        }
        AddElement() {
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'x').step(0.01).listen();
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'y').step(0.01).listen();
            this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'z').step(0.01).listen();
            this.positionFolder.open();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'x', 0, Math.PI * 2).listen();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'y', 0, Math.PI * 2).listen();
            this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'z', 0, Math.PI * 2).listen();
            this.rotateFolder.open();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'x', 0).step(0.01).listen();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'y', 0).step(0.01).listen();
            this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'z', 0).step(0.01).listen();
            this.scaleFolder.open();
            this.isPlayerFunc = function () {
                this.isPlayer = function () {
                    console.log(JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.IsPlayer);
                    JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.IsPlayer = true;
                    console.log(JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.IsPlayer);
                };
            };
            this.isPlayerFunc = new this.isPlayerFunc();
            this.isPlayerFolder.add(this.isPlayerFunc, 'isPlayer');
            this.isPlayerFolder.open();
        }
        SetGameObject(gameObject) {
            this.gameObject = gameObject;
            this.datGui.removeFolder(this.positionFolder);
            this.datGui.removeFolder(this.rotateFolder);
            this.datGui.removeFolder(this.scaleFolder);
            this.datGui.removeFolder(this.isPlayerFolder);
            this.CreateFolder();
            this.AddElement();
        }
        UpdateDisplay() {
            this.datGui.updateDisplay();
        }
        ShowGUI(show) {
            if (show == true) {
                this.datGui.open();
            }
            else {
                this.datGui.close();
            }
            this.gameObject.PhysicsComponent.UpdateMatrix();
        }
    }
    JWFramework.GUI_SRT = GUI_SRT;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=GUI_SRT.js.map