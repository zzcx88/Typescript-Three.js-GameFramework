var JWFramework;
(function (JWFramework) {
    class Picker {
        constructor() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickMode = JWFramework.PickMode.PICK_MODIFY;
            this.orbitControl = new THREE.OrbitControls(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance, JWFramework.WorldManager.getInstance().Canvas);
            this.orbitControl.maxDistance = 200;
            this.orbitControl.minDistance = 0;
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
        GetParentName(intersectedObjects) {
            if (intersectedObjects.type != "Group") {
                this.GetParentName(intersectedObjects.parent);
            }
            else {
                this.pickedParentName = intersectedObjects.name;
                this.pickedObject = intersectedObjects;
            }
        }
        PickOffObject() {
            let objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            for (let i = 0; i < objectList.length; ++i) {
                objectList[i].GameObject.Picked = false;
            }
        }
        Pick() {
            if (this.pickPositionX > 0.75 || this.pickPositionX == -1) {
                return;
            }
            this.PickOffObject();
            this.pickedObject = undefined;
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            if (this.pickMode == JWFramework.PickMode.PICK_CLONE) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);
                //클론된 오브젝트를 생성한다.
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName(JWFramework.GUIManager.getInstance().GUI_Select.GetSelectObjectName()));
                cloneObject.GameObjectInstance.position.set(0, 0, 0);
                cloneObject.GameObjectInstance.position.copy(intersectedObject[0].point);
                JWFramework.SceneManager.getInstance().SceneInstance.add(cloneObject.GameObjectInstance);
                objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
            }
            //터레인은 키보드 입력으로 높낮이 조절 가능하게 할것
            else if (this.pickMode == JWFramework.PickMode.PICK_TERRAIN) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObject(objectManager.GetObjectFromName("Terrain").GameObjectInstance, true);
                let terrain = objectManager.GetObjectFromName("Terrain");
                terrain.SetHeight(intersectedObject[0].face.a);
                terrain.SetHeight(intersectedObject[0].face.b);
                terrain.SetHeight(intersectedObject[0].face.c);
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_REMOVE) {
                let intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    this.pickedParent.DeleteObject();
                }
            }
            else {
                let intersectedObjects = this.raycaster.intersectObjects(JWFramework.SceneManager.getInstance().SceneInstance.children);
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    console.log(this.pickedParentName);
                    this.pickedParent.Picked = true;
                    JWFramework.GUIManager.getInstance().GUI_SRT.SetGameObject(this.pickedParent);
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
        get OrbitControl() {
            return this.orbitControl;
        }
    }
    JWFramework.Picker = Picker;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Picker.js.map