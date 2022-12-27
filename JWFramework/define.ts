/// <reference path="Object/EditObject/EditObject.ts" />
namespace JWFramework
{
    export class Define
    {
        static readonly SCREEN_WIDTH: number = window.innerWidth;
        static readonly SCREEN_HEIGHT: number = window.innerHeight;
    }

    export class ModelSceneBase {
        private static instance;

        static getInstance(modelSceneType: string) {
            if (!ModelSceneBase.instance) {
                ModelSceneBase.instance = new JWFramework[modelSceneType];
            }
            return ModelSceneBase.instance;
        }

        public constructor() {
            this.sceneModelData = [
            ];
            this.modelNumber = this.sceneModelData.length;
        }
        public get ModelScene(): ModelSet[] {
            return this.sceneModelData;
        }

        public get ModelNumber(): number {
            return this.modelNumber;
        }

        protected sceneModelData: ModelSet[] = [];

        protected modelNumber: number;
    }

    export class ModelSceneEdit extends ModelSceneBase
    {

        public constructor()
        {
            super();
            this.mig23.Name = "MIG_23_MLD";
            this.mig29.Name = "MIG_29";
            this.helmet.Name = "helmet";
            this.flower.Name = "flower";
            this.anim.Name = "animation";
            this.sceneModelData = [
                //{ model: this.F16, url: 'Model/F-16D/F-16.gltf' },
                { model: this.mig23, url: 'Model/mig_23_mld.glb' },
                { model: this.mig29, url: 'Model/mig_29.glb' },
                { model: this.helmet, url: 'Model/DamagedHelmet.gltf' },
                { model: this.flower, url: 'Model/cloud.glb' },
                { model: this.anim, url: 'Model/Sprint.glb' }
            ];
            this.modelNumber = this.sceneModelData.length;
        }

        private helmet: EditObject = new EditObject;
        private mig23: EditObject = new EditObject;
        private mig29: EditObject = new EditObject;
        private flower: EditObject = new EditObject;
        private anim: EditObject = new EditObject;
    }



    export class ModelSceneStage
    {
        private static instance: ModelSceneStage;

        static getInstance()
        {
            if (!ModelSceneStage.instance) {
                ModelSceneStage.instance = new ModelSceneStage;
            }
            return ModelSceneStage.instance;
        }

        public constructor()
        {
            this.F16.Name = "F-16";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf' },
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        public get ModelScene(): ModelSet[]
        {
            return this.sceneTestModel;
        }

        public get ModelNumber(): number
        {
            return this.modelNumber;
        }

        private F16: EditObject = new EditObject;
        private sceneTestModel: ModelSet[] = [];

        private modelNumber: number;
    }


    export interface ModelSet
    {
        model: GameObject;
        url: string;
    }

    export interface ObjectSet
    {
        GameObject: GameObject;
        Name: string;
    }

    export interface KeySet
    {
        KeyCode: number;
        KeyName: string;
        KeyEvent: boolean;
        KeyDown: boolean;
        KeyPressed: boolean;
        KeyUp: boolean;
    }
}