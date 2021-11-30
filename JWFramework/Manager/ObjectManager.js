var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
            this.objectList = [];
            this.exportObjectList = [];
        }
        static getInstance() {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        }
        GetObjectsFromType() { }
        GetObjectFromName(name) {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (name == this.objectList[i].GameObject.Name) {
                    return this.objectList[i].GameObject;
                }
            }
            return null;
        }
        get GetObjectList() {
            return this.objectList;
        }
        ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }
        AddObject(gameObject, name, type) {
            this.objectList.push({ GameObject: gameObject, Name: name });
        }
        MakeClone(selectObject) {
            let cloneObject = new JWFramework.TestObject;
            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + ObjectManager.getInstance().GetObjectList.length.toString();
            cloneObject.GameObjectInstance = selectObject.GameObjectInstance.clone();
            cloneObject.InitializeAfterLoad();
            return cloneObject;
        }
        MakeJSONArray() {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (this.objectList[i].GameObject.IsClone == true || this.objectList[i].GameObject.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                    this.exportObjectList.push(this.objectList[i].GameObject.ExportComponent.MakeJsonObject());
                }
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(this.exportObjectList, null, 2)], {
                type: "text/plain"
            }));
            a.setAttribute("download", "Scene.json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.ClearExportObjectList();
        }
        DeleteObject(gameObject) {
            JWFramework.SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
            gameObject.GameObjectInstance.traverse(node => {
                if (node.isMesh) {
                    if (node.geometry) {
                        node.geometry.dispose();
                    }
                    if (node.material)
                        if (Array.isArray(node.material)) {
                            for (let i = 0; i < node.material.length; ++i)
                                node.material[i].dispose();
                        }
                        else {
                            node.material.dispose();
                        }
                }
            });
            this.ClearExportObjectList();
        }
        DeleteAllObject() {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (this.objectList[i].GameObject.Name != "Terrain") {
                    this.DeleteObject(this.objectList[i].GameObject);
                    delete this.objectList[i];
                    this.objectList = this.objectList.filter((element, i) => element !== undefined);
                }
            }
        }
        RenderOffObject() { }
        Animate() {
            for (let i = 0; i < this.objectList.length; ++i) {
                this.objectList[i].GameObject.Animate();
                if (this.objectList[i].GameObject.PhysicsCompIncluded == true)
                    this.objectList[i].GameObject.PhysicsComponent.UpdateMatrix();
                if (this.objectList[i].GameObject.IsDead) {
                    this.DeleteObject(this.objectList[i].GameObject);
                    delete this.objectList[i];
                    this.objectList = this.objectList.filter((element, i) => element !== undefined);
                }
            }
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map