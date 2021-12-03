namespace JWFramework {
    export class Picker {
        public constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;

            this.pickMode = PickMode.PICK_MODIFY;

            this.CreateOrtbitControl();

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

        private CreateOrtbitControl() {
            this.orbitControl = new THREE.OrbitControls(WorldManager.getInstance().MainCamera.CameraInstance, WorldManager.getInstance().Canvas);
            this.orbitControl.maxDistance = 2000;
            this.orbitControl.minDistance = -2000;
            this.orbitControl.zoomSpeed = 2;
            this.orbitControl.maxZoom = -2000;
            this.orbitControl.panSpeed = 3;
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
            for (let TYPE = ObjectType.OBJ_OBJECT3D; TYPE < ObjectType.OBJ_OBJECT2D; ++TYPE) {
                for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ) {
                    objectList[TYPE][OBJ].GameObject.Picked = false;
                }
            }
        }

        public Pick() {
            if (this.pickPositionX > 0.75 || this.pickPositionX == -1) {
                return;
            }
            this.PickOffObject();
            this.pickedObject = undefined;

            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, WorldManager.getInstance().MainCamera.CameraInstance);

            if (this.pickMode == PickMode.PICK_CLONE) {
                let objectManager = ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);

                //클론된 오브젝트를 생성한다.
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName(GUIManager.getInstance().GUI_Select.GetSelectObjectName()));
                cloneObject.GameObjectInstance.position.set(0, 0, 0);
                let clonePosition: THREE.Vector3 = new THREE.Vector3(intersectedObject[0].point.x, intersectedObject[0].point.y + 10, intersectedObject[0].point.z);
                cloneObject.GameObjectInstance.position.copy(clonePosition);
                
                SceneManager.getInstance().SceneInstance.add(cloneObject.GameObjectInstance);
                objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);

            }
            //터레인은 키보드 입력으로 높낮이 조절 가능하게 할것
            else if (this.pickMode == PickMode.PICK_TERRAIN) {
                let objectManager = ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);
                let terrain = objectManager.GetObjectFromName("Terrain");
                //console.log(intersectedObject[0].faceIndex)
                (terrain as unknown as HeightmapTerrain).SetHeight(intersectedObject[0].face.a);
                (terrain as unknown as HeightmapTerrain).SetHeight(intersectedObject[0].face.b);
                (terrain as unknown as HeightmapTerrain).SetHeight(intersectedObject[0].face.c);
            }
            else if (this.pickMode == PickMode.PICK_REMOVE) {
                let intersectedObjects = this.raycaster.intersectObjects(SceneManager.getInstance().SceneInstance.children);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    this.pickedParent.DeleteObject();
                }
            }
            else {
                let intersectedObjects = this.raycaster.intersectObject(SceneManager.getInstance().SceneInstance);
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
            this.pickMode = PickMode.PICK_MODIFY;
        }

        public ChangePickModeClone() {
            this.pickMode = PickMode.PICK_CLONE;
        }

        public ChangePickModeTerrain() {
            this.pickMode = PickMode.PICK_TERRAIN;
        }

        public ChangePickModeRemove() {
            this.pickMode = PickMode.PICK_REMOVE;
        }

        public get PickMode(): PickMode {
            return this.pickMode;
        }

        public get OrbitControl(): THREE.OrbitControls {
            return this.orbitControl;
        }

        public GetPickParents(): GameObject {
            return this.pickedParent;
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