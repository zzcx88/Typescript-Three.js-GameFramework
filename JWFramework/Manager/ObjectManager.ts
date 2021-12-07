namespace JWFramework {
    export class ObjectManager {

        private static instance: ObjectManager;

        public constructor() {}

        static getInstance() {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        }

        public GetObjectsFromType() { }

        public GetObjectFromName(name: string): GameObject {
            for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (name == this.objectList[TYPE][OBJ].GameObject.Name) {
                        return this.objectList[TYPE][OBJ].GameObject;
                    }
                }
            }
            return null;
        }

        public GetInSectorTerrain(): HeightmapTerrain {
            let terrain;
            for (let OBJ = 0; OBJ < this.objectList[ObjectType.OBJ_TERRAIN].length; ++OBJ) {
                terrain = this.objectList[ObjectType.OBJ_TERRAIN][OBJ].GameObject;
                if ((terrain as unknown as HeightmapTerrain).cameraInSecter == true)
                    return terrain;
            }
        }

        public get GetObjectList() {
            return this.objectList;
        }

        public ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }

        public AddObject(gameObject: GameObject, name: string, type: ObjectType) {
            this.objectList[type].push({ GameObject: gameObject, Name: name });
        }

        public MakeClone(selectObject: GameObject): GameObject {
            let cloneObject: TestObject = new TestObject;
            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + ObjectManager.getInstance().GetObjectList[cloneObject.Type].length.toString();
            cloneObject.GameObjectInstance = selectObject.GameObjectInstance.clone();
            cloneObject.InitializeAfterLoad();
            return cloneObject;
        }

        public MakeJSONArray() {
            for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (this.objectList[TYPE][OBJ].GameObject.IsClone == true || this.objectList[TYPE][OBJ].GameObject.Type == ObjectType.OBJ_TERRAIN) {
                        this.exportObjectList.push(this.objectList[TYPE][OBJ].GameObject.ExportComponent.MakeJsonObject())
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

        public DeleteObject(gameObject: GameObject) {
            SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
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

        public DeleteAllObject() {
            this.objectList.forEach(function (type) {
                type.forEach(function (object) {
                    if (object.GameObject.Type != ObjectType.OBJ_CAMERA)
                        object.GameObject.IsDead = true;
                })
            })
        }

        private RenderOffObject() { }

        public Animate() {
            for (let TYPE = 0; TYPE < ObjectType.OBJ_END; ++TYPE) {
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
            CollisionManager.getInstance().CollideBoxToBox(this.objectList[ObjectType.OBJ_TERRAIN], this.objectList[ObjectType.OBJ_CAMERA]);
            //CollisionManager.getInstance().CollideBoxToBox(this.objectList[ObjectType.OBJ_TERRAIN], this.objectList[ObjectType.OBJ_OBJECT3D]);
            //let sectoredTerrain = this.objectList[ObjectType.OBJ_TERRAIN].filter((element) => (element.GameObject as unknown as HeightmapTerrain).inSecter == true);
            CollisionManager.getInstance().CollideRayToTerrain(this.objectList[ObjectType.OBJ_OBJECT3D], this.objectList[ObjectType.OBJ_TERRAIN]);
        }

        public Render() { }

        private objectList: ObjectSet[][] = [[],[],[],[]];
        private exportObjectList = [];
    }
}