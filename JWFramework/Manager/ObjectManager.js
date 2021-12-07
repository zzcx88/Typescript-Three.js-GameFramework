var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
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
                if (terrain.cameraInSecter == true)
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
            gameObject.CollisionComponent.DeleteCollider();
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
            this.objectList.forEach(function (type) {
                type.forEach(function (object) {
                    if (object.GameObject.Type != JWFramework.ObjectType.OBJ_CAMERA)
                        object.GameObject.IsDead = true;
                });
            });
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
            JWFramework.CollisionManager.getInstance().CollideBoxToBox(this.objectList[JWFramework.ObjectType.OBJ_TERRAIN], this.objectList[JWFramework.ObjectType.OBJ_CAMERA]);
            //CollisionManager.getInstance().CollideBoxToBox(this.objectList[ObjectType.OBJ_TERRAIN], this.objectList[ObjectType.OBJ_OBJECT3D]);
            //let sectoredTerrain = this.objectList[ObjectType.OBJ_TERRAIN].filter((element) => (element.GameObject as unknown as HeightmapTerrain).inSecter == true);
            JWFramework.CollisionManager.getInstance().CollideRayToTerrain(this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D], this.objectList[JWFramework.ObjectType.OBJ_TERRAIN]);
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map