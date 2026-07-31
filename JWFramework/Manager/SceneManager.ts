import * as THREE from 'three';
import { EditScene } from '../Scene/EditScene';
import { ObjectManager } from './ObjectManager';
import type { SceneBase } from '../Scene/SceneBase';
import { SceneType } from '../enum';


export class SceneManager
{

    private static instance: SceneManager;

    public constructor() { }

    static getInstance()
    {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager;
        }
        return SceneManager.instance;
    }

    public get SceneInstance(): THREE.Scene
    {
        return this.sceneThree;
    }

    public get CurrentScene(): SceneBase
    {
        return this.scene;
    }

    public get SceneType(): SceneType
    {
        return this.sceneType;
    }

    public MakeJSON()
    {
        ObjectManager.getInstance().MakeJSONArray();
    }

    public BuildScene()
    {
        this.sceneThree = new THREE.Scene();
        this.sceneType = SceneType.SCENE_EDIT;
        this.objectManager = ObjectManager.getInstance();

        switch (this.sceneType) {
            case SceneType.SCENE_EDIT:
                this.scene = new EditScene(this);
                break;
            case SceneType.SCENE_START:
                break;
            case SceneType.SCENE_STAGE:
                break;
        }
    }

    public Animate()
    {
        this.scene.Animate();
    }

    private sceneThree: THREE.Scene;
    private sceneType: number;
    private scene: SceneBase;
    private objectManager: ObjectManager;
}
