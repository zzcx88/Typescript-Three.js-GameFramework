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

        public DeleteObject() {
            for (let i = 0; i < this.objectList.length; ++i) {
                SceneManager.getInstance().SceneInstance.remove(this.objectList[i].GameObject.GameObjectInstance);
                this.objectList[i].GameObject.GameObjectInstance.traverse(node => {
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
          
    }
    interface ObjectSet {
        GameObject: GameObject;
        Name: string;
    }
}