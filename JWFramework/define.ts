import { EditObject } from './Object/EditObject/EditObject';
import type { GameObject } from './Object/GameObject';
import { R60M } from './Object/InGameObject/Weapons/IRMissile/R60M';
import { Water } from './Object/InGameObject/Environment/Water';


export class Define
{
    static readonly SCREEN_WIDTH: number = window.innerWidth;
    static readonly SCREEN_HEIGHT: number = window.innerHeight;
}

export class ModelSceneBase {
    private static instance;

    static getInstance(modelSceneType: string) {
        if (!ModelSceneBase.instance) {
            const ctor = modelSceneRegistry[modelSceneType];
            if (ctor == null)
                throw new Error(`ModelScene '${modelSceneType}' 가 modelSceneRegistry 에 등록되지 않았습니다.`);
            ModelSceneBase.instance = new ctor();
        }
        return ModelSceneBase.instance;
    }

    public constructor() {
        this.sceneModelData = [];
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
        this.tree.Name = "Tree";
        this.f_5e.Name = "F-5E";
        this.anim.Name = "Animation";
        this.r60.Name = "R-60M"
        this.water.Name = "Water";
        this.sceneModelData = [
            { model: this.mig29, mainUrl: 'Model/mig_29_1.glb', lodUrl: 'Model/mig_29_LOD_1.glb' },
            { model: this.tree, mainUrl: 'Model/Tree/tree_lv3.glb', lodUrl: null },
            { model: this.f_5e, mainUrl: 'Model/F-5E.glb', lodUrl: null },
            { model: this.anim, mainUrl: 'Model/Sprint.glb', lodUrl: null},
            { model: this.r60, mainUrl: 'Model/aim-9.glb', lodUrl: null},
            { model: this.water, mainUrl: null, lodUrl: null},
        ];
        this.modelNumber = this.sceneModelData.length;
    }

    private tree: EditObject = new EditObject;
    private mig29: EditObject = new EditObject;
    private f_5e: EditObject = new EditObject;
    private anim: EditObject = new EditObject;
    private r60: R60M = new R60M;
    private water: Water = new Water;
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
            { model: this.F16, mainUrl: 'Model/F-16D/F-16.gltf', lodUrl: null },
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


/**
 * 씬별 모델 목록 클래스 레지스트리.
 *
 * 전역 `namespace JWFramework` 시절에는 `new JWFramework[modelSceneType]` 으로
 * 문자열 조회가 가능했지만 ESM 에는 네임스페이스 객체가 없다.
 * 새 ModelScene 클래스를 추가하면 **여기에도 등록**해야 한다.
 *   ↳ 이 문자열 조회 자체를 걷어내는 건 ROADMAP P1-C
 */
const modelSceneRegistry: Record<string, new () => ModelSceneBase> = {
    ModelSceneEdit,
};

export interface ModelSet
{
    model: GameObject;
    mainUrl: string;
    lodUrl: string;
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
