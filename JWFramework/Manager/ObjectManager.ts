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

        public ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }

        public MakeJSONArray() {
            for (let i = 0; i < this.objectList.length; ++i) {
                this.exportObjectList.push(this.objectList[i].GameObject.ExportComponent.MakeJsonObject())
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(this.exportObjectList, null, 3)], {
                type: "text/plain"
            }));
            a.setAttribute("download", "data.json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.ClearExportObjectList();
        }

        public DeleteObject() {

        }

        public DeleteAllObject() {
            for (let i = 0; i < this.objectList.length; ++i) {
                if (this.objectList[i].GameObject.Name != "Terrain") {
                    this.objectList[i].GameObject.DeleteObject();
                    delete this.objectList[i];
                }
                this.ClearExportObjectList();
                //SceneManager.getInstance().SceneInstance.remove(this.objectList[i].GameObject.GameObjectInstance);
                //this.objectList[i].GameObject.GameObjectInstance.traverse(node => {
                //    if (node.isMesh) {
                //        if (node.geometry) {
                //            node.geometry.dispose();
                //        }
                //        if (node.material)
                //            if (Array.isArray(node.material)) {
                //                for (let i = 0; i < node.material.length; ++i)
                //                    node.material[i].dispose();
                //            }
                //            else {
                //                node.material.dispose();
                //            }
                //    }
                //});
            }
        }
        private RenderOffObject() { }

        public Animate() {
            for (let i = 0; i < this.objectList.length; ++i) {
                this.objectList[i].GameObject.Animate();
                if (this.objectList[i].GameObject.GraphicCompIncluded == true)
                    this.objectList[i].GameObject.PhysicsComponent.UpdateMatrix();
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