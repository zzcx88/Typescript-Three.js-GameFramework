namespace JWFramework {
    export class Picker {
        public constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;

            this.orbitControl = new THREE.OrbitControls(WorldManager.getInstance().MainCamera.CameraInstance, WorldManager.getInstance().Canvas);

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
            if (intersectedObjects.type != "Group") {
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
                    this.PickOffObject();
                    this.pickedObject = undefined;
                }
            }
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);

            //this.raycaster.ray.origin = WorldManager.getInstance().MainCamera.CameraInstance.position;
            //let vec3 = WorldManager.getInstance().MainCamera.CameraInstance.matrixWorld.elements;
            //let look = new THREE.Vector3(-vec3[8], -vec3[9], -vec3[10]).normalize();
            //console.log(look);
            //console.log(this.raycaster.ray.direction);
            //this.raycaster.ray.direction = look;
            let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
            if (intersectedObjects.length) {
                if (intersectedObjects[0].object.name == "Terrain") {
                    ObjectManager.getInstance().GetObjectFromName("Terrain").Picked = true;
                }
               else {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    this.pickedParent.Picked = true;
                }
            }
        }

        private GetCanvasReleativePosition(event) {
            let rect = WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * WorldManager.getInstance().Canvas.height / rect.height,
            };
        }

        public SetPickPosition(event) {
            //let pos = this.GetCanvasReleativePosition(event);
            //this.pickPositionX = (pos.x / WorldManager.getInstance().Canvas.width) * 2 - 1;
            //this.pickPositionY = (pos.y / WorldManager.getInstance().Canvas.height) * 2 - 1;
            this.pickPositionX = (event.clientX / window.innerWidth) * 2 - 1;
            this.pickPositionY = - (event.clientY / window.innerHeight) * 2 + 1;
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

        private orbitControl: THREE.OrbitControls;

        private pickedParentName: string;
    }
}