var JWFramework;
(function (JWFramework) {
    var Picker = /** @class */ (function () {
        function Picker() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
            this.orbitControl = new THREE.OrbitControls(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance, JWFramework.WorldManager.getInstance().Canvas);
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
        Picker.prototype.GetParentName = function (intersectedObjects) {
            if (intersectedObjects.type != "Group") {
                this.GetParentName(intersectedObjects.parent);
            }
            else {
                this.pickedParentName = intersectedObjects.name;
                this.pickedObject = intersectedObjects;
            }
        };
        Picker.prototype.PickOffObject = function () {
            var objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            for (var i = 0; i < objectList.length; ++i) {
                objectList[i].GameObject.Picked = false;
            }
        };
        Picker.prototype.Pick = function () {
            if (this.pickedObject) {
                if (this.pickPositionX < 0.75) {
                    this.PickOffObject();
                    this.pickedObject = undefined;
                }
            }
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            //this.raycaster.ray.origin = WorldManager.getInstance().MainCamera.CameraInstance.position;
            //let vec3 = WorldManager.getInstance().MainCamera.CameraInstance.matrixWorld.elements;
            //let look = new THREE.Vector3(-vec3[8], -vec3[9], -vec3[10]).normalize();
            //console.log(look);
            //console.log(this.raycaster.ray.direction);
            //this.raycaster.ray.direction = look;
            var intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                this.GetParentName(intersectedObjects[0].object);
                this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                this.pickedParent.Picked = true;
            }
        };
        Picker.prototype.GetCanvasReleativePosition = function (event) {
            var rect = JWFramework.WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * JWFramework.WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * JWFramework.WorldManager.getInstance().Canvas.height / rect.height,
            };
        };
        Picker.prototype.SetPickPosition = function (event) {
            //let pos = this.GetCanvasReleativePosition(event);
            //this.pickPositionX = (pos.x / WorldManager.getInstance().Canvas.width) * 2 - 1;
            //this.pickPositionY = (pos.y / WorldManager.getInstance().Canvas.height) * 2 - 1;
            this.pickPositionX = (event.clientX / window.innerWidth) * 2 - 1;
            this.pickPositionY = -(event.clientY / window.innerHeight) * 2 + 1;
            this.Pick();
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