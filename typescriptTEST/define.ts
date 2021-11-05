namespace JWFramework {
    export class Define {
        static SCREEN_WIDTH: number = window.innerWidth;
        static SCREEN_HEIGHT: number = window.innerHeight;
    }

    export class ModelSceneTest {
        private static instance: ModelSceneTest;

        static getInstance() {
            if (!ModelSceneTest.instance) {
                ModelSceneTest.instance = new ModelSceneTest;
            }
            return ModelSceneTest.instance;
        }

        public constructor() {
            
        }
        public get ModelSceneTest(): ModelSet[] {
            return this.sceneTestModel;
        }
        private helmet: TestObject = new TestObject;
        private sceneTestModel: ModelSet[] = [{
            model: this.helmet, url: 'Model/DamagedHelmet.gltf'
        }];
    }
    export interface ModelSet {
        model: GameObject;
        url: string;
    }
}