namespace JWFramework {
    export class Picker {
        public constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;

            window.addEventListener('mousedown', function (e) {
                SceneManager.getInstance().CurrentScene.Picker.SetPickPosition(e);
            });
            window.addEventListener('mouseout', function (e) {
                SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
            window.addEventListener('mouseleave', function (e) {
                SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
        }

        private GetParentName(intersectedObjects: THREE.Object3D) {
            if (intersectedObjects.parent.name) {
                this.GetParentName(intersectedObjects.parent);
            }
            else {
                this.pickedParentName = intersectedObjects.name;
                this.pickedObject = intersectedObjects;
            }
        }

        private PickOffObject() {
            let objectList = ObjectManager.getInstance().GetObjectList;
            for (let i = 0; i < objectList.length; ++i) {
                objectList[i].GameObject.Picked = false;
            }
        }

        public Pick() {
            if (this.pickedObject) {
                if (this.pickPositionX < 0.75) {
                    //Pick을 하나만 켜지게 한다?
                    this.PickOffObject();
                    //this.pickedParent.Picked = false;
                    //this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                    //this.pickedObject = undefined;
                }
            }
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);
            let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
            console.log(intersectedObjects[0].object.name);
            if (intersectedObjects.length) {
                this.GetParentName(intersectedObjects[0].object);
                this.pickedParent = ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                this.pickedParent.Picked = true;
                //this.pickedObject = intersectedObjects[0].object;
                //this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                //this.pickedObject.material.emissive.setHex(0x000000);
            }
        }

        private GetCanvasReleativePosition(event) {
            let rect = WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * WorldManager.getInstance().Canvas.height / rect.height,
            };
        }

        private SetPickPosition(event) {
            let pos = this.GetCanvasReleativePosition(event);
            this.pickPositionX = (pos.x / WorldManager.getInstance().Canvas.width) * 2 - 1;
            this.pickPositionY = (pos.y / WorldManager.getInstance().Canvas.height) * 2 - 1;
            this.Pick();
        }

        public ClearPickPosition() {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        }

        private raycaster: THREE.Raycaster;
        private pickedObject;
        private pickedObjectSavedColor: number;
        private pickedParent: GameObject;
        private pickPositionX = 0;
        private pickPositionY = 0;

        private pickedParentName: string;
    }
}