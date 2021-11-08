var JWFramework;
(function (JWFramework) {
    var Picker = /** @class */ (function () {
        function Picker() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
            window.addEventListener('mousemove', function (e) {
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
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }
            console.log(this.pickPositionX, this.pickPositionY);
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            var intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                this.pickedObject = intersectedObjects[0].object;
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                this.pickedObject.material.emissive.setHex(0x000000);
            }
        };
        //private GetCanvasReleativePosition(event) {
        //    let rect = WorldManager.getInstance().Canvas.getBoundingClientRect();
        //    return {
        //        x: (event.clientX - rect.left) * WorldManager.getInstance().Canvas.width / rect.width,
        //        y: (event.clientY - rect.top) * WorldManager.getInstance().Canvas.height / rect.height,
        //    };
        //}
        Picker.prototype.SetPickPosition = function (event) {
            // let pos = this.GetCanvasReleativePosition(event);
            var rect = JWFramework.WorldManager.getInstance().Canvas.getBoundingClientRect();
            var x = (event.clientX - rect.left) * JWFramework.WorldManager.getInstance().Canvas.width / rect.width;
            var y = (event.clientY - rect.top) * JWFramework.WorldManager.getInstance().Canvas.height / rect.height;
            this.pickPositionX = (x / JWFramework.WorldManager.getInstance().Canvas.width) * 2 - 1;
            this.pickPositionY = (y / JWFramework.WorldManager.getInstance().Canvas.height) * 2 - 1;
        };
        Picker.prototype.ClearPickPosition = function () {
            console.log(this);
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        };
        return Picker;
    }());
    JWFramework.Picker = Picker;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Picker.js.map