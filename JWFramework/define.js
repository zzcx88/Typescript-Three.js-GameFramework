var JWFramework;
(function (JWFramework) {
    class Define {
    }
    Define.SCREEN_WIDTH = window.innerWidth;
    Define.SCREEN_HEIGHT = window.innerHeight;
    JWFramework.Define = Define;
    class ModelSceneEdit {
        constructor() {
            this.helmet = new JWFramework.EditObject;
            this.F16 = new JWFramework.EditObject;
            this.flower = new JWFramework.EditObject;
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
            if (!ModelSceneEdit.instance) {
                ModelSceneEdit.instance = new ModelSceneEdit;
            }
            return ModelSceneEdit.instance;
        }
        get ModelScene() {
            return this.sceneTestModel;
        }
        get ModelNumber() {
            return this.modelNumber;
        }
    }
    JWFramework.ModelSceneEdit = ModelSceneEdit;
    class ModelSceneStage {
        constructor() {
            this.F16 = new JWFramework.EditObject;
            this.sceneTestModel = [];
            this.F16.Name = "F-16";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf' },
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        static getInstance() {
            if (!ModelSceneStage.instance) {
                ModelSceneStage.instance = new ModelSceneStage;
            }
            return ModelSceneStage.instance;
        }
        get ModelScene() {
            return this.sceneTestModel;
        }
        get ModelNumber() {
            return this.modelNumber;
        }
    }
    JWFramework.ModelSceneStage = ModelSceneStage;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=define.js.map