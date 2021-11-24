var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
            this.objectList = [];
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
        DeleteObject() {
            for (let i = 0; i < this.objectList.length; ++i) {
                JWFramework.SceneManager.getInstance().SceneInstance.remove(this.objectList[i].GameObject.GameObjectInstance);
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
        RenderOffObject() { }
        Animate() {
            for (let i = 0; i < this.objectList.length; ++i) {
                this.objectList[i].GameObject.Animate();
                if (this.objectList[i].GameObject.GraphicCompIncluded == true)
                    this.objectList[i].GameObject.PhysicsComponent.UpdateMatrix();
            }
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ObjectManager.js.map