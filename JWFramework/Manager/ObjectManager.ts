namespace JWFramework {
    export class ObjectManager {

        private static instance: ObjectManager;

        public constructor() { }

        static getInstance() {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        }

        public GetObjectsFromType() { }

        public GetObjectFromName(name: string): GameObject {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (name == this.objectList[i].GameObject.Name) {
                    return this.objectList[i].GameObject;
                }
            }
            return null;
        }
        public get GetObjectList() {
            return this.objectList;
        }

        public ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }

        public AddObject(gameObject: GameObject, name: string, type: ObjectType) {
            this.objectList.push({ GameObject: gameObject, Name: name });
        }

        public MakeClone(selectObject: GameObject): GameObject {
            let cloneObject: TestObject = new TestObject;
            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + ObjectManager.getInstance().GetObjectList.length.toString();
            cloneObject.GameObjectInstance = selectObject.GameObjectInstance.clone();
            cloneObject.InitializeAfterLoad();
            return cloneObject;
        }

        public MakeJSONArray() {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (this.objectList[i].GameObject.IsClone == true || this.objectList[i].GameObject.Type == ObjectType.OBJ_TERRAIN) {
                    this.exportObjectList.push(this.objectList[i].GameObject.ExportComponent.MakeJsonObject())
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
            for (let i = 0; i < this.objectList.length; ++i) {
                if (this.objectList[i].GameObject.Name != "Terrain") {
                    this.DeleteObject(this.objectList[i].GameObject);
                    delete this.objectList[i];
                    this.objectList = this.objectList.filter((element, i) => element !== undefined);
                }
            }
        }

        private RenderOffObject() { }

        public Animate() {
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

        public Render() { }

        private objectList: ObjectSet[] = [];
        private exportObjectList = [];
    }
    interface ObjectSet {
        GameObject: GameObject;
        Name: string;
    }
}