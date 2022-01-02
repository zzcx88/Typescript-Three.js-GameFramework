namespace JWFramework {
    export class Define {
        static readonly SCREEN_WIDTH: number = window.innerWidth;
        static readonly SCREEN_HEIGHT: number = window.innerHeight;
    }

    export class ModelSceneEdit {
        private static instance: ModelSceneEdit;
        ModelSceneEdit
        static getInstance() {
            if (!ModelSceneEdit.instance) {
                ModelSceneEdit.instance = new ModelSceneEdit;
            }
            return ModelSceneEdit.instance;
        }

        public constructor() {
            this.F16.Name = "F-16";
            this.helmet.Name = "helmet";
            this.flower.Name = "flower";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf'},
                { model: this.helmet, url: 'Model/DamagedHelmet.gltf'},
                { model: this.flower, url: 'Model/Flower.glb'}
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        public get ModelScene(): ModelSet[] {
            return this.sceneTestModel;
        }

        public get ModelNumber(): number {
            return this.modelNumber;
        }

        private helmet: EditObject = new EditObject;
        private F16: EditObject = new EditObject;
        private flower: EditObject = new EditObject;
        private sceneTestModel: ModelSet[] = [];

        private modelNumber: number;
    }



    export class ModelSceneStage {
        private static instance: ModelSceneStage;
        ModelSceneEdit
        static getInstance() {
            if (!ModelSceneStage.instance) {
                ModelSceneStage.instance = new ModelSceneStage;
            }
            return ModelSceneStage.instance;
        }

        public constructor() {
            this.F16.Name = "F-16";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf' },
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        public get ModelScene(): ModelSet[] {
            return this.sceneTestModel;
        }

        public get ModelNumber(): number {
            return this.modelNumber;
        }

        private F16: EditObject = new EditObject;
        private sceneTestModel: ModelSet[] = [];

        private modelNumber: number;
    }


    export interface ModelSet {
        model: GameObject;
        url: string;
    }

    export interface ObjectSet {
        GameObject: GameObject;
        Name: string;
    }

    export interface KeySet {
        KeyCode: number;
        KeyName: string;
        KeyEvent: boolean;
        KeyDown: boolean;
        KeyPressed: boolean;
        KeyUp: boolean;
    }
}