/// <reference path="Object/EditObject/EditObject.ts" />
/// <reference path="Object/InGameObject/Weapons/IRMissile/AIM9H.ts" />
/// <reference path="Object/InGameObject/Weapons/IRMissile/AIM9L.ts" />
/// <reference path="Object/InGameObject/Weapons/IRMissile/R60M.ts" />
/// <reference path="Object/InGameObject/MissileFog.ts" />
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
            this.mig29.Name = "MIG_29";
            this.helmet.Name = "helmet";
            this.f_5e.Name = "F-5E";
            this.anim.Name = "animation";
            this.aim9h.Name = "AIM-9H";
            this.aim9l.Name = "AIM-9L";
            this.r60m.Name = "R-60M";
            this.cloud.Name = "Cloud";
            this.sceneModelData = [
                //{ model: this.F16, url: 'Model/F-16D/F-16.gltf' },
                { model: this.aim9h, url: 'Model/aim-9.glb' },
                { model: this.aim9l, url: 'Model/aim-9.glb' },
                { model: this.r60m, url: 'Model/aim-9.glb' },
                { model: this.mig29, url: 'Model/mig_29_1.glb' },
                { model: this.helmet, url: 'Model/DamagedHelmet.gltf' },
                { model: this.f_5e, url: 'Model/F-5E.glb' },
                { model: this.anim, url: 'Model/Sprint.glb' },
                { model: this.cloud, url: 'Model/cloud.glb' },
            ];
            this.modelNumber = this.sceneModelData.length;
        }

        private helmet: EditObject = new EditObject;
        private mig29: EditObject = new EditObject;
        private f_5e: EditObject = new EditObject;
        private anim: EditObject = new EditObject;
        private cloud: Cloud = new Cloud;
        private aim9h: AIM9H = new AIM9H;
        private aim9l: AIM9L = new AIM9L;
        private r60m: R60M = new R60M;
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