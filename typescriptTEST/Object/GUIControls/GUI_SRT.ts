namespace JWFramework {
    export class GUI_SRT extends GUI_Base {

        constructor(gameObject: GameObject) {
            super();
            this.datGui = new dat.GUI;
            this.gameObject = gameObject;

            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
        }

        protected CreateFolder() {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
        }

        protected AddElement() {
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
        }

        public UpdateDisplay() {
            this.datGui.updateDisplay();
        }

        public ShowGUI(show: boolean) {
            if (show == true) {
                this.datGui.open();
            }
            else {
                this.datGui.close();
            }

        }


        private datGui: dat.GUI;
        private gameObject: GameObject;
        private toggle: boolean = false;
        private positionFolder: dat.GUI;
        private rotateFolder: dat.GUI;
        private scaleFolder: dat.GUI;
    }
}