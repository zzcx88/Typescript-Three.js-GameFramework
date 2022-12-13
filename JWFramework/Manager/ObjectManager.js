var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
            this.terrainList = new THREE.Group();
            this.objectList = [[], [], [], [], []];
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
                    this.terrainList.add(terrain.GameObjectInstance);
            }
            return this.terrainList;
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
            let cloneObject;
            if (selectObject instanceof JWFramework.EditObject) {
                cloneObject = new JWFramework.EditObject;
            }
            else {
                if (selectObject == null)
                    alert("EmtyObject");
                else
                    alert(selectObject.Name.toUpperCase() + " Instance of class name not found");
                return;
            }
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
                            for (let i = 0; i < node.material.length; ++i) {
                                node.material[i].dispose();
                                if (node.material[i].map)
                                    node.material[i].map.dispose();
                            }
                        }
                        else {
                            node.material.dispose();
                            if (node.material.map)
                                node.material.map.dispose();
                        }
                }
            });
            this.ClearExportObjectList();
        }
        DeleteAllObject() {
            this.objectList.forEach(function (type) {
                type.forEach(function (object) {
                    if (object.GameObject.Type != JWFramework.ObjectType.OBJ_CAMERA && object.GameObject.IsClone == true)
                        object.GameObject.IsDead = true;
                });
            });
        }
        RenderOffObject() { }
        Animate() {
            for (let TYPE = 0; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    this.objectList[TYPE][OBJ].GameObject.Animate();
                    if (this.objectList[TYPE][OBJ].GameObject.PhysicsCompIncluded == true && TYPE != JWFramework.ObjectType.OBJ_TERRAIN)
                        this.objectList[TYPE][OBJ].GameObject.PhysicsComponent.UpdateMatrix();
                    if (this.objectList[TYPE][OBJ].GameObject.IsDead) {
                        this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                        delete this.objectList[TYPE][OBJ];
                        this.objectList[TYPE] = this.objectList[TYPE].filter((element, OBJ) => element !== undefined);
                    }
                }
            }
            JWFramework.CollisionManager.getInstance().CollideObbToObb(this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D], this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D]);
            JWFramework.CollisionManager.getInstance().CollideRayToTerrain(this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D], this.objectList[JWFramework.ObjectType.OBJ_TERRAIN]);
            JWFramework.InputManager.getInstance().UpdateKey();
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map