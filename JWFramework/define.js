var JWFramework;
(function (JWFramework) {
    class Define {
    }
    Define.SCREEN_WIDTH = window.innerWidth;
    Define.SCREEN_HEIGHT = window.innerHeight;
    JWFramework.Define = Define;
    class ModelSceneTest {
        constructor() {
            this.helmet = new JWFramework.TestObject;
            this.F16 = new JWFramework.TestObject;
            this.flower = new JWFramework.TestObject;
            this.sceneTestModel = [];
            this.F16.Name = "F-16";
            this.helmet.Name = "helmet";
            this.flower.Name = "flower";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf' },
                { model: this.helmet, url: 'Model/DamagedHelmet.gltf' },
                { model: this.flower, url: 'Model/Flower.glb' }
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        static getInstance() {
            if (!ModelSceneTest.instance) {
                ModelSceneTest.instance = new ModelSceneTest;
            }
            return ModelSceneTest.instance;
        }
        get ModelSceneTest() {
            return this.sceneTestModel;
        }
        get ModelNumber() {
            return this.modelNumber;
        }
    }
    JWFramework.ModelSceneTest = ModelSceneTest;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=define.js.map