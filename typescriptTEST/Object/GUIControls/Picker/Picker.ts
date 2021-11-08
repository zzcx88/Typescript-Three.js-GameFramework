namespace JWFramework {
    export class Picker {
        public constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;

            window.addEventListener('mousemove', function (e) {
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
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            console.log(this.pickPositionX, this.pickPositionY);
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);
            let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                this.pickedObject = intersectedObjects[0].object;
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                this.pickedObject.material.emissive.setHex(0x000000);
            }
        }

        //private GetCanvasReleativePosition(event) {
        //    let rect = WorldManager.getInstance().Canvas.getBoundingClientRect();
        //    return {
        //        x: (event.clientX - rect.left) * WorldManager.getInstance().Canvas.width / rect.width,
        //        y: (event.clientY - rect.top) * WorldManager.getInstance().Canvas.height / rect.height,
        //    };
        //}

        private SetPickPosition(event) {
           // let pos = this.GetCanvasReleativePosition(event);
            let rect = WorldManager.getInstance().Canvas.getBoundingClientRect();
            let x = (event.clientX - rect.left) * WorldManager.getInstance().Canvas.width / rect.width;
            let y = (event.clientY - rect.top) * WorldManager.getInstance().Canvas.height / rect.height;
            this.pickPositionX = (x / WorldManager.getInstance().Canvas.width) * 2 - 1;
            this.pickPositionY = (y / WorldManager.getInstance().Canvas.height) * 2 - 1;

        }

        public ClearPickPosition() {
            console.log(this);
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