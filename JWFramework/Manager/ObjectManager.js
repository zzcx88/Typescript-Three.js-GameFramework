var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
            this.objectListType = [];
            this.objectList = [[], [], [], []];
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
            for (let TYPE = JWFramework.ObjectType.OBJ_TERRAIN; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (name == this.objectList[TYPE][OBJ].GameObject.Name) {
                        return this.objectList[TYPE][OBJ].GameObject;
                    }
                }
            }
            return null;
        }
        GetInSectorTerrain() {
            let terrain;
            for (let OBJ = 0; OBJ < this.objectList[JWFramework.ObjectType.OBJ_TERRAIN].length; ++OBJ) {
                terrain = this.objectList[JWFramework.ObjectType.OBJ_TERRAIN][OBJ].GameObject;
                if (terrain.inSecter == true)
                    return terrain;
            }
        }
        get GetObjectList() {
            return this.objectList;
        }
        ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }
        AddObject(gameObject, name, type) {
            //this.objectList.push({ GameObject: gameObject, Name: name });
            this.objectList[type].push({ GameObject: gameObject, Name: name });
        }
        MakeClone(selectObject) {
            let cloneObject = new JWFramework.TestObject;
            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + ObjectManager.getInstance().GetObjectList[cloneObject.Type].length.toString();
            cloneObject.GameObjectInstance = selectObject.GameObjectInstance.clone();
            cloneObject.InitializeAfterLoad();
            return cloneObject;
        }
        MakeJSONArray() {
            for (let TYPE = JWFramework.ObjectType.OBJ_TERRAIN; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (this.objectList[TYPE][OBJ].GameObject.IsClone == true || this.objectList[TYPE][OBJ].GameObject.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        this.exportObjectList.push(this.objectList[TYPE][OBJ].GameObject.ExportComponent.MakeJsonObject());
                    }
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
            for (let TYPE = JWFramework.ObjectType.OBJ_OBJECT3D; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                    delete this.objectList[TYPE][OBJ];
                    this.objectList[TYPE] = this.objectList[TYPE].filter((element, OBJ) => element !== undefined);
                }
            }
            //for (let i = 0; i < this.objectList.length; ++i) {
            //    if (this.objectList[i].GameObject.Name != "Terrain") {
            //        this.DeleteObject(this.objectList[i].GameObject);
            //        delete this.objectList[i];
            //        this.objectList = this.objectList.filter((element, i) => element !== undefined);
            //    }
            //}
        }
        RenderOffObject() { }
        Animate() {
            for (let TYPE = 0; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    this.objectList[TYPE][OBJ].GameObject.Animate();
                    if (this.objectList[TYPE][OBJ].GameObject.PhysicsCompIncluded == true)
                        this.objectList[TYPE][OBJ].GameObject.PhysicsComponent.UpdateMatrix();
                    if (this.objectList[TYPE][OBJ].GameObject.IsDead) {
                        this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                        delete this.objectList[TYPE][OBJ];
                        this.objectList[TYPE] = this.objectList[TYPE].filter((element, OBJ) => element !== undefined);
                    }
                }
            }
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map