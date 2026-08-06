import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GUI_Base } from './GUI_Base';


/**
 * 색·조명 조정용 **임시 패널**.
 *
 * 값 하나 바꿀 때마다 소스 수정 → 빌드 → 리로드를 돌리는 비용이 너무 커서 만들었다.
 * 여기서 눈으로 맞춘 뒤 `PrintValues` 버튼으로 찍어 소스에 반영하는 용도다.
 * → 상세는 docs/색관리-재조정-설계.md 페이즈 4
 *
 * **이 파일은 리프 모듈로 유지한다.** 프로젝트 모듈을 런타임 import 하면
 * 매니저 싱글턴 순환 덩어리(SCC)에 끌려 들어가 `npm run check:cycles` 가 실패한다.
 * 그래서 조작 대상을 클래스가 아니라 아래 **구조적 인터페이스**로만 받는다.
 *
 * dat.GUI 교체(ROADMAP P1-A)에서 통째로 걷어낼 예정 — 지우기 쉽게 의존을 한 방향으로만 뒀다.
 */
interface IntensityTarget
{
    Intensity: number;
}

interface WaterTuning
{
    /** 씬 재로드(Del)로 파괴된 물은 목록에서 걷어내기 위해 본다. */
    readonly IsDead: boolean;
    SetSunColor(hex: number): void;
    SetWaterColor(hex: number): void;
}

export class GUI_Color extends GUI_Base
{
    constructor(renderer: THREE.WebGLRenderer, width: number)
    {
        super();
        this.renderer = renderer;

        this.datGui = new GUI();
        this.datGui.domElement.id = 'color-gui-container';

        this.datGui.open();
        this.CreateFolder();
        this.AddElement();
        this.datGui.width = width;

        // 패널보다 먼저 만들어진 물이 있으면 지금 붙인다.
        GUI_Color.instance = this;
        for (let i = 0; i < GUI_Color.waterList.length; ++i)
            this.ApplyWaterColor(GUI_Color.waterList[i]);
    }

    /**
     * 물은 `Scene.json` 로드 시점에 생기므로 패널이 먼저일 수도, 물이 먼저일 수도 있다.
     * 양쪽 다 되도록 목록에 담아두고 붙는 쪽에서 반영한다.
     */
    public static RegisterWater(water: WaterTuning)
    {
        GUI_Color.waterList.push(water);
        if (GUI_Color.instance != null)
            GUI_Color.instance.ApplyWaterColor(water);
    }

    public BindLight(directional: IntensityTarget, ambient: IntensityTarget)
    {
        this.directionalLight = directional;
        this.ambientLight = ambient;
        // 패널 초기값을 현재 소스 값으로 맞춘다 (붙이자마자 화면이 튀지 않게).
        this.propList.Directional = directional.Intensity;
        this.propList.Ambient = ambient.Intensity;
    }

    protected CreateFolder()
    {
        this.toneFolder = this.datGui.addFolder('Tone');
        this.lightFolder = this.datGui.addFolder('Light');
        this.waterFolder = this.datGui.addFolder('Water');
    }

    protected AddElement()
    {
        const toneItem = ['None', 'ACESFilmic', 'Neutral', 'Reinhard', 'Cineon', 'AgX'];

        this.toneFolder.add(this.propList, 'ToneMapping', toneItem).listen()
            .onChange(() => { this.ApplyToneMapping(); });
        this.toneFolder.add(this.propList, 'Exposure', 0, 3).step(0.01).listen()
            .onChange(() => { this.renderer.toneMappingExposure = this.propList.Exposure; });
        this.toneFolder.open();

        this.lightFolder.add(this.propList, 'Directional', 0, 6).step(0.01).listen()
            .onChange(() =>
            {
                if (this.directionalLight != null)
                    this.directionalLight.Intensity = this.propList.Directional;
            });
        this.lightFolder.add(this.propList, 'Ambient', 0, 6).step(0.01).listen()
            .onChange(() =>
            {
                if (this.ambientLight != null)
                    this.ambientLight.Intensity = this.propList.Ambient;
            });
        this.lightFolder.open();

        this.waterFolder.addColor(this.propList, 'SunColor').listen()
            .onChange(() => { this.ApplyWaterColorAll(); });
        this.waterFolder.addColor(this.propList, 'WaterColor').listen()
            .onChange(() => { this.ApplyWaterColorAll(); });
        this.waterFolder.open();

        this.datGui.add(this.printer, 'PrintValues');
    }

    private ApplyToneMapping()
    {
        // 톤매핑을 바꾸면 three 가 셰이더를 다시 컴파일한다 (WebGLRenderer.js 의 needsProgramChange).
        // 즉 여기서 renderer 값만 바꿔주면 되고, 머티리얼을 따로 건드릴 필요가 없다.
        if (this.propList.ToneMapping == 'ACESFilmic')
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        else if (this.propList.ToneMapping == 'Neutral')
            this.renderer.toneMapping = THREE.NeutralToneMapping;
        else if (this.propList.ToneMapping == 'Reinhard')
            this.renderer.toneMapping = THREE.ReinhardToneMapping;
        else if (this.propList.ToneMapping == 'Cineon')
            this.renderer.toneMapping = THREE.CineonToneMapping;
        else if (this.propList.ToneMapping == 'AgX')
            this.renderer.toneMapping = THREE.AgXToneMapping;
        else
            this.renderer.toneMapping = THREE.NoToneMapping;
    }

    private ApplyWaterColorAll()
    {
        // 재로드로 죽은 물은 여기서 걷어낸다 (등록 해제 훅을 따로 두지 않았다).
        GUI_Color.waterList = GUI_Color.waterList.filter(water_ => water_.IsDead == false);
        for (let i = 0; i < GUI_Color.waterList.length; ++i)
            this.ApplyWaterColor(GUI_Color.waterList[i]);
    }

    private ApplyWaterColor(water: WaterTuning)
    {
        water.SetSunColor(this.HexStringToNumber(this.propList.SunColor));
        water.SetWaterColor(this.HexStringToNumber(this.propList.WaterColor));
    }

    /** dat.GUI 의 addColor 는 '#rrggbb' 문자열을 준다. */
    private HexStringToNumber(value: string): number
    {
        return parseInt(value.replace('#', ''), 16);
    }

    private datGui: GUI;
    private toneFolder: GUI;
    private lightFolder: GUI;
    private waterFolder: GUI;

    private renderer: THREE.WebGLRenderer;
    private directionalLight: IntensityTarget = null;
    private ambientLight: IntensityTarget = null;

    // 소스의 현재 값과 일치시켜 둔다. 어긋나면 패널이 뜨는 순간 화면이 바뀐다.
    // (Directional/Ambient 는 BindLight() 가 실제 Light 에서 다시 읽어 덮어쓰므로
    //  어긋나도 동작에는 영향이 없다. 그래도 표시 기준값이라 맞춰 둔다.)
    private propList = {
        ToneMapping: 'None',
        Exposure: 1.0,
        Directional: 1,
        Ambient: 1.5,
        SunColor: '#c0c0c0',
        WaterColor: '#080831'
    };

    // dat.GUI 는 함수 프로퍼티를 버튼으로 만든다.
    private printer = {
        PrintValues: () =>
        {
            console.log(
                '[GUI_Color] 아래 값을 소스에 반영하세요\n' +
                `  WorldManager.CreateRenderer()  toneMapping = ${this.propList.ToneMapping}\n` +
                `                                toneMappingExposure = ${this.propList.Exposure}\n` +
                `  EditScene.BuildLight()        directional = ${this.propList.Directional}\n` +
                `                                ambient     = ${this.propList.Ambient}\n` +
                `  Water.CreateWaterMesh()       sunColor    = 0x${this.propList.SunColor.replace('#', '')}\n` +
                `                                waterColor  = 0x${this.propList.WaterColor.replace('#', '')}`);
        }
    };

    private static instance: GUI_Color = null;
    private static waterList: WaterTuning[] = [];
}
