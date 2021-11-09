var JWFramework;
(function (JWFramework) {
    var Picker = /** @class */ (function () {
        function Picker() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
            window.addEventListener('mousedown', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.SetPickPosition(e);
            });
            window.addEventListener('mouseout', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
            window.addEventListener('mouseleave', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
        }
        Picker.prototype.Pick = function () {
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
        };
        Picker.prototype.GetCanvasReleativePosition = function (event) {
            var rect = JWFramework.WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * JWFramework.WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * JWFramework.WorldManager.getInstance().Canvas.height / rect.height,
            };
        };
        Picker.prototype.SetPickPosition = function (event) {
            var pos = this.GetCanvasReleativePosition(event);
            this.pickPositionX = (pos.x / JWFramework.WorldManager.getInstance().Canvas.width) * 2 - 1;
            this.pickPositionY = (pos.y / JWFramework.WorldManager.getInstance().Canvas.height) * 2 - 1;
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            var intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                JWFramework.ObjectManager.getInstance().GetObjectFromName(intersectedObjects[0].object.parent.name).Picked = true;
                this.pickedObject = intersectedObjects[0].object;
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                this.pickedObject.material.emissive.setHex(0x000000);
            }
        };
        Picker.prototype.ClearPickPosition = function () {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        };
        return Picker;
    }());
    JWFramework.Picker = Picker;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Picker.js.map