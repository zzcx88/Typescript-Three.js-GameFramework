namespace JWFramework {
    export class Picker {
        public constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;

            this.pickMode = PickMode.Pick_Modify;

            this.orbitControl = new THREE.OrbitControls(WorldManager.getInstance().MainCamera.CameraInstance, WorldManager.getInstance().Canvas);

            window.addEventListener('click', function (e) {
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

            if (this.pickMode == PickMode.Pick_Clone) {
                let objectManager = ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);

                //클론된 오브젝트를 생성한다.
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName(GUIManager.getInstance().GUI_Select.GetSelectObjectName()));
                cloneObject.GameObjectInstance.position.set(0, 0, 0);
                cloneObject.GameObjectInstance.position.copy(intersectedObject[0].point);

                SceneManager.getInstance().SceneInstance.add(cloneObject.GameObjectInstance);
                objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);

            }
            else if (this.pickMode == PickMode.Pick_Terrain) {
                let objectManager = ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);

                let terrain = objectManager.GetObjectFromName("Terrain");
                (terrain as unknown as HeightmapTerrain).SetHeight(intersectedObject[0].face.a);
            }
            else {
                let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    this.pickedParent.Picked = true;
                    GUIManager.getInstance().GUI_SRT.SetGameObject(this.pickedParent);
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
            this.pickPositionX = (event.clientX / window.innerWidth) * 2 - 1;
            this.pickPositionY = - (event.clientY / window.innerHeight) * 2 + 1;
            this.Pick();
        }

        public ClearPickPosition() {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        }

        public ChangePickModeModify() {
            this.pickMode = PickMode.Pick_Modify;
        }

        public ChangePickModeClone() {
            this.pickMode = PickMode.Pick_Clone;
        }

        public ChangePickModeTerrain() {
            this.pickMode = PickMode.Pick_Terrain;
        }

        private pickMode: PickMode;

        private raycaster: THREE.Raycaster;
        private pickedObject;
        private pickedParent: GameObject;
        private pickPositionX = 0;
        private pickPositionY = 0;

        private orbitControl: THREE.OrbitControls;

        private pickedParentName: string;
    }
}