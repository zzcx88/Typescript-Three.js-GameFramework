namespace JWFramework
{
    export class GUI_SRT extends GUI_Base
    {

        constructor(gameObject: GameObject)
        {
            super();
            this.datGui = new dat.GUI;
            this.datGui.open();
            this.gameObject = gameObject;

            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
        }

        protected CreateFolder()
        {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
            this.isPlayerFolder = this.datGui.addFolder('IsPlayer');
        }

        protected AddElement()
        {

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

            this.isPlayerFunc = function ()
            {
                this.isPlayer = function ()
                {
                    GUIManager.getInstance().GUI_SRT.gameObject.IsPlayer = true;
                }
            }

            this.isPlayerFunc = new this.isPlayerFunc();

            this.isPlayerFolder.add(this.isPlayerFunc, 'isPlayer');
            this.isPlayerFolder.open();
        }

        public SetGameObject(gameObject: GameObject)
        {
            this.gameObject = gameObject;

            this.datGui.removeFolder(this.positionFolder);
            this.datGui.removeFolder(this.rotateFolder);
            this.datGui.removeFolder(this.scaleFolder);
            this.datGui.removeFolder(this.isPlayerFolder);

            this.CreateFolder()
            this.AddElement();
        }

        public UpdateDisplay()
        {
            this.datGui.updateDisplay();
        }

        public ShowGUI(show: boolean)
        {
            if (show == true)
            {
                this.datGui.open();
            }
            else
            {
                this.datGui.close();
            }
            this.gameObject.PhysicsComponent.UpdateMatrix();
        }

        private datGui: dat.GUI;
        private gameObject: GameObject;
        private positionFolder: dat.GUI;
        private rotateFolder: dat.GUI;
        private scaleFolder: dat.GUI;
        private isPlayerFolder: dat.GUI;

        private isPlayerFunc;
    }
}