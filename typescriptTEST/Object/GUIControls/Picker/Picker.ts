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

        public Pick() {
            //if (this.pickedObject) {
            //    this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            //    this.pickedObject = undefined;
            //}
            //this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);
            //let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
            //if (intersectedObjects.length) {
            //    let pickedParent = ObjectManager.getInstance().GetObjectFromName(intersectedObjects[0].object.parent.name);
            //    pickedParent.Picked = true;
            //    this.pickedObject = intersectedObjects[0].object;
            //    this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            //    this.pickedObject.material.emissive.setHex(0x000000);
            //}
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

            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);
            let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                ObjectManager.getInstance().GetObjectFromName(intersectedObjects[0].object.parent.name).Picked = true;
                this.pickedObject = intersectedObjects[0].object;
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                this.pickedObject.material.emissive.setHex(0x000000);
            }

        }

        public ClearPickPosition() {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        }

        private raycaster: THREE.Raycaster;
        private pickedObject;
        private pickedObjectSavedColor: number;
        private pickPositionX = 0;
        private pickPositionY = 0;
    }
}