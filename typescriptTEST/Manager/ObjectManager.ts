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
        public GetObjectAll() { }

        public AddObject(gameObject: GameObject, name: string, type: ObjectType) {
            this.objectList.push({ GameObject: gameObject, Name: name });
        }

        private DeleteObject() { }
        private RenderOffObject() { }

        public Animate() {
            for (let i = 0; i < this.objectList.length; ++i) {
                this.objectList[i].GameObject.Animate();
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