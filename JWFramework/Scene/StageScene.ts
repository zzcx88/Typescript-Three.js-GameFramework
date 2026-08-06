import * as THREE from 'three';
import { InputManager } from '../Manager/InputManager';
import { KeyState, LightType } from '../enum';
import { Light } from '../Object/Light/Light';
import { ModelLoadManager } from '../Manager/ModelLoadManager';
import { ObjectManager } from '../Manager/ObjectManager';
import { SceneBase } from './SceneBase';
import type { SceneManager } from '../Manager/SceneManager';
import { WorldManager } from '../Manager/WorldManager';


export class StageScene extends SceneBase
{
    constructor(sceneManager: SceneManager)
    {
        super(sceneManager);
    }

    BuildSkyBox()
    {
        
    }

    BuildObject()
    {
        ModelLoadManager.getInstance().LoadScene();
        const rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
        WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
    }

    BuildLight()
    {
        // r165 에서 레거시 조명 모드(intensity × π)가 제거되어 값을 다시 잡아야 했다.
        // EditScene 은 π 배(0.6 → 1.885)에서 출발해 눈으로 1 까지 내렸다 — 실효 배율 1.666.
        // 여기도 같은 배율을 옛 값에 적용한다:  1.5 × 1.666 = 2.5  ·  0.7 × 1.666 = 1.167
        //
        // 키:필 비율(1.5 : 0.7)을 그대로 두려고 배율만 곱했다. EditScene 처럼 개별 조정하지
        // 않은 것은 **이 씬이 아직 생성되지 않아 눈으로 확인할 방법이 없기 때문**이다
        // (SceneManager.BuildScene() 의 SCENE_STAGE case 가 비어 있다).
        //
        // ⚠ 검증된 값이 아니다. 여기 라이트 2개는 개발 초기 잔재이고,
        //   씬을 살릴 때는 **EditScene 과 동일한 환경(조명·포그·스카이박스)으로 새로 잡는다.**
        //   이 블록을 그대로 쓰지 말 것 — ROADMAP P3-A
        this.light = new Light(LightType.LIGHT_DIRECTIONAL);
        this.light.SetColor(0xFFFFFF);
        this.light.Intensity = 2.5;
        this.light.GameObjectInstance.position.set(10000, 10000, 0);

        this.light2 = new Light(LightType.LIGHT_DIRECTIONAL);
        this.light2.SetColor(0xFFFFFF);
        this.light2.Intensity = 1.167;
        this.light2.GameObjectInstance.position.set(-10000, -10000, 0);

        this.SceneManager.SceneInstance.add(this.light.GameObjectInstance);
        //this.sceneManager.SceneInstance.add(this.light2.GameObjectInstance);
    }
    BuildFog()
    {
        const sceneInstance = this.SceneManager.SceneInstance;
        const color = 0xdefdff;
        sceneInstance.fog = new THREE.Fog(color, 10, 1000);
    }

    public Animate()
    {
        if (ModelLoadManager.getInstance().LoadComplete == true) {
            ObjectManager.getInstance().Animate();

            if (InputManager.getInstance().GetKeyState('1', KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeModify();
            }
            if (InputManager.getInstance().GetKeyState('2', KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeClone();
            }
            if (InputManager.getInstance().GetKeyState('3', KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeTerrain();
            }
            if (InputManager.getInstance().GetKeyState('4', KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeRemove();
            }
            if (InputManager.getInstance().GetKeyState('5', KeyState.KEY_DOWN)) {
                fetch("./Model/Scene.json")
                    .then(response =>
                    {
                        return response.json();
                    })
                    .then(jsondata => console.log(jsondata[0]));
                this.BuildObject();
            }
            if (InputManager.getInstance().GetKeyState('delete', KeyState.KEY_DOWN)) {
                ObjectManager.getInstance().DeleteAllObject();
            }
        }
    }
    private light: Light;
    private light2: Light;
    private terrain = [];
}
