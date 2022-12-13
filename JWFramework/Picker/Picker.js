var JWFramework;
(function (JWFramework) {
    class Picker {
        constructor() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickMode = JWFramework.PickMode.PICK_MODIFY;
            this.CreateOrtbitControl();
            window.addEventListener('mousemove', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.mouseEvent = e;
            });
            window.addEventListener('click', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.SetPickPosition(e);
            });
            window.addEventListener('mouseout', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
            window.addEventListener('mouseleave', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
        }
        CreateOrtbitControl() {
            this.orbitControl = new THREE.OrbitControls(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance, JWFramework.WorldManager.getInstance().Canvas);
            this.orbitControl.maxDistance = 2000;
            this.orbitControl.minDistance = -2000;
            this.orbitControl.zoomSpeed = 2;
            this.orbitControl.maxZoom = -2000;
            this.orbitControl.panSpeed = 3;
        }
        GetParentName(intersectedObjects) {
            if (intersectedObjects != null) {
                if (intersectedObjects.type == "Mesh") {
                    this.pickedParentName = undefined;
                }
                if (intersectedObjects.type != "Group") {
                    this.GetParentName(intersectedObjects.parent);
                }
                else {
                    this.pickedParentName = intersectedObjects.name;
                    this.pickedObject = intersectedObjects;
                }
            }
        }
        PickOffObject() {
            let objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            for (let TYPE = JWFramework.ObjectType.OBJ_OBJECT3D; TYPE < JWFramework.ObjectType.OBJ_OBJECT2D; ++TYPE) {
                for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ) {
                    objectList[TYPE][OBJ].GameObject.Picked = false;
                }
            }
        }
        Pick() {
            let terrain;
            if (this.pickPositionX > 0.75 || this.pickPositionX == -1) {
                return;
            }
            this.PickOffObject();
            this.pickedObject = undefined;
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            if (this.pickMode == JWFramework.PickMode.PICK_CLONE) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(JWFramework.SceneManager.getInstance().SceneInstance, true);
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName(JWFramework.GUIManager.getInstance().GUI_Select.GetSelectObjectName()));
                let terrain = objectManager.GetObjectFromName(intersectedObject[0].object.name);
                if (terrain.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                    cloneObject.GameObjectInstance.position.set(0, 0, 0);
                    let clonePosition = new THREE.Vector3(intersectedObject[0].point.x, intersectedObject[0].point.y + 10, intersectedObject[0].point.z);
                    cloneObject.GameObjectInstance.position.copy(clonePosition);
                    JWFramework.SceneManager.getInstance().SceneInstance.add(cloneObject.GameObjectInstance);
                    objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                }
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_TERRAIN) {
                JWFramework.GUIManager.getInstance().GUI_Terrain.SetTerrainOptionList();
                let heightOffset = JWFramework.GUIManager.getInstance().GUI_Terrain.GetHeightOffset();
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(JWFramework.SceneManager.getInstance().SceneInstance, true);
                if (intersectedObject[0] != undefined) {
                    terrain = objectManager.GetObjectFromName(intersectedObject[0].object.name);
                    if (terrain != null && terrain.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        intersectedObject[0].face.normal;
                        terrain.SetHeight(intersectedObject[0].face.a, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                        terrain.SetHeight(intersectedObject[0].face.b, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                        terrain.SetHeight(intersectedObject[0].face.c, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                    }
                }
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_REMOVE) {
                let intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    if (this.pickedParentName != undefined)
                        this.pickedParent.DeleteObject();
                }
            }
            else {
                let intersectedObjects = this.raycaster.intersectObject(JWFramework.SceneManager.getInstance().SceneInstance);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    if (this.pickedParentName != undefined) {
                        this.pickedParent.Picked = true;
                        JWFramework.GUIManager.getInstance().GUI_SRT.SetGameObject(this.pickedParent);
                    }
                }
            }
        }
        GetCanvasReleativePosition(event) {
            let rect = JWFramework.WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * JWFramework.WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * JWFramework.WorldManager.getInstance().Canvas.height / rect.height,
            };
        }
        get MouseEvent() {
            return this.mouseEvent;
        }
        SetPickPosition(event) {
            this.pickPositionX = (event.clientX / window.innerWidth) * 2 - 1;
            this.pickPositionY = -(event.clientY / window.innerHeight) * 2 + 1;
            this.Pick();
        }
        ClearPickPosition() {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        }
        ChangePickModeModify() {
            this.pickMode = JWFramework.PickMode.PICK_MODIFY;
        }
        ChangePickModeClone() {
            this.pickMode = JWFramework.PickMode.PICK_CLONE;
        }
        ChangePickModeTerrain() {
            this.pickMode = JWFramework.PickMode.PICK_TERRAIN;
        }
        ChangePickModeRemove() {
            this.pickMode = JWFramework.PickMode.PICK_REMOVE;
        }
        get PickMode() {
            return this.pickMode;
        }
        get OrbitControl() {
            return this.orbitControl;
        }
        GetPickParents() {
            return this.pickedParent;
        }
    }
    JWFramework.Picker = Picker;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Picker.js.map