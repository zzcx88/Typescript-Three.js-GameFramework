namespace JWFramework
{
    export class GUI_SRT extends GUI_Base
    {

        constructor(gameObject: GameObject)
        {
            super();
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'srt-gui-container';
            this.datGui.open();
            this.gameObject = gameObject;
            this.defaultPosition = new THREE.Vector3(0, 0, 0);
            this.defaultRotate = new THREE.Vector3(0, 0, 0);
            this.defaultScale = new THREE.Vector3(1, 1, 1);
            this.defaultBounding = new THREE.Vector3(1, 1, 1);

            this.CreateFolder();
            this.AddElement();
            this.datGui.width = WorldManager.getInstance().Canvas.width / 8;

            
        }

        protected CreateFolder()
        {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
            this.boundingBoxFolder = this.datGui.addFolder("BoundingBox");
            this.isPlayerFolder = this.datGui.addFolder('IsPlayer');
        }

        protected AddElement()
        {
            if (this.gameObject instanceof Camera)
            {
                this.positionFolder.add(this.defaultPosition, 'x').step(0.01).listen();
                this.positionFolder.add(this.defaultPosition, 'y').step(0.01).listen();
                this.positionFolder.add(this.defaultPosition, 'z').step(0.01).listen();
                this.positionFolder.open();

                this.rotateFolder.add(this.defaultRotate, 'x', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.defaultRotate, 'y', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.defaultRotate, 'z', 0, Math.PI * 2).listen();
                this.rotateFolder.open();

                this.scaleFolder.add(this.defaultScale, 'x', 0).step(0.01).listen();
                this.scaleFolder.add(this.defaultScale, 'y', 0).step(0.01).listen();
                this.scaleFolder.add(this.defaultScale, 'z', 0).step(0.01).listen();
                this.scaleFolder.open();

                this.boundingBoxFolder.add(this.defaultBounding, 'x', 0).step(0.01).listen();
                this.boundingBoxFolder.add(this.defaultBounding, 'y', 0).step(0.01).listen();
                this.boundingBoxFolder.add(this.defaultBounding, 'z', 0).step(0.01).listen();

                const onChangeIsBoundingEditable = function (value: boolean)
                {
                    GUIManager.getInstance().GUI_SRT.defaultEditableBounding = value;
                };

                this.boundingBoxFolder.add({ isBoundingEditable: this.defaultEditableBounding }, 'isBoundingEditable')
                    .name('Enable Bounding Editable')
                    .onChange(onChangeIsBoundingEditable);

                this.boundingBoxFolder.open();
            }
            else if (this.gameObject.IsClone && this.gameObject.Picked)
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

                if (this.gameObject.CollisionComponent.OBBInclude)
                {
                    this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'x').step(0.01).listen();
                    this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'y').step(0.01).listen();
                    this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'z').step(0.01).listen();
                }
                if (this.gameObject.CollisionComponent.BoundingSphereInclude)
                {
                    this.boundingBoxFolder.add(this.gameObject.CollisionComponent, 'radius').step(0.01).listen();
                }

                const onChangeIsBoundingEditable = function (value: boolean)
                {
                    GUIManager.getInstance().GUI_SRT.gameObject.CollisionComponent.IsEditable = value;
                    GUIManager.getInstance().GUI_SRT.SetGameObject(GUIManager.getInstance().GUI_SRT.gameObject);
                };

                this.boundingBoxFolder.add({ isBoundingEditable: GUIManager.getInstance().GUI_SRT.gameObject.CollisionComponent.IsEditable }, 'isBoundingEditable')
                    .name('Enable Bounding Editable')
                    .onChange(onChangeIsBoundingEditable);

                this.boundingBoxFolder.open();

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
        }

        public SetGameObject(gameObject: GameObject) {
            this.gameObject = gameObject;

           // if (this.positionFolder == null) {
                //this.datGui.removeFolder(this.positionFolder);
                //this.datGui.removeFolder(this.rotateFolder);
                //this.datGui.removeFolder(this.scaleFolder);
                //this.datGui.removeFolder(this.boundingBoxFolder);
                //this.datGui.removeFolder(this.isPlayerFolder);

                //this.CreateFolder()
                //this.AddElement();
            //}
            //else {
                this.gameObject = gameObject;

                // Update position folder
                if (this.positionFolder !== undefined) {
                    this.positionFolder.__controllers.forEach(controller => {
                        controller.object = this.gameObject.GameObjectInstance.position;
                    });
                }

                // Update rotation folder
                if (this.rotateFolder !== undefined) {
                    this.rotateFolder.__controllers.forEach(controller => {
                        controller.object = this.gameObject.GameObjectInstance.rotation;
                    });
                }

                // Update scale folder
                if (this.scaleFolder !== undefined) {
                    this.scaleFolder.__controllers.forEach(controller => {
                        controller.object = this.gameObject.GameObjectInstance.scale;
                    });
                }

                // Update bounding box folder
                if (this.boundingBoxFolder !== undefined) {
                    if (this.gameObject.CollisionComponent.OBBInclude) {
                        this.boundingBoxFolder.__controllers.forEach(controller => {
                            if (controller.property === "x" || controller.property === "y" || controller.property === "z") {
                                controller.object = this.gameObject.CollisionComponent.halfSize;
                            }
                        });
                    }
                    if (this.gameObject.CollisionComponent.BoundingSphereInclude) {
                        this.boundingBoxFolder.__controllers.forEach(controller => {
                            if (controller.property === "radius") {
                                controller.object = this.gameObject.CollisionComponent;
                            }
                        });
                    }
                }
            //}
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
            //this.gameObject.PhysicsComponent.UpdateMatrix();
        }

        public get DefaultRotate(): THREE.Vector3
        {
            return this.defaultRotate;
        }

        public get DefaultScale(): THREE.Vector3
        {
            return this.defaultScale;
        }

        public get DefaultBounding(): THREE.Vector3
        {
            return this.defaultBounding;
        }

        public get DefaultEditableBounding(): boolean
        {
            return this.defaultEditableBounding;
        }

        private datGui: dat.GUI;
        private gameObject: GameObject;
        private positionFolder: dat.GUI;
        private rotateFolder: dat.GUI;
        private scaleFolder: dat.GUI;
        private boundingBoxFolder: dat.GUI;
        private isPlayerFolder: dat.GUI;

        private defaultPosition: THREE.Vector3;
        private defaultRotate: THREE.Vector3;
        private defaultScale: THREE.Vector3;
        private defaultBounding: THREE.Vector3;
        private defaultEditableBounding: boolean = false;

        private isBoundingEditableFunc;
        private isPlayerFunc;
    }
}