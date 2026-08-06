import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BlendShader } from 'three/examples/jsm/shaders/BlendShader.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { Cloud } from '../Object/InGameObject/Environment/Cloud';
import { SceneManager } from './SceneManager';
import { SplattingShader } from '../Shader/SplattingShader';
import { WorldManager } from './WorldManager';


export class ShaderManager
{

    private static instance: ShaderManager;

    public constructor()
    {
        this.BuildMotionBlurShader();
        this.splattingShader = new SplattingShader();

        // 아래 5종은 SplattingShader(커스텀 ShaderMaterial)가 쓴다.
        // 커스텀 셰이더는 출력 sRGB 인코딩이 자동으로 붙지 않으므로,
        // 여기의 태그(디코딩)와 SplattingShader 의 <colorspace_fragment>(인코딩)는
        // **반드시 함께** 있어야 한다. 하나만 있으면 한쪽 방향으로만 감마가 걸린다.
        this.farmTexture = new THREE.TextureLoader().load("Model/Heightmap/farm.jpg");
        this.farmTexture.wrapS = THREE.RepeatWrapping;
        this.farmTexture.wrapT = THREE.RepeatWrapping;
        this.farmTexture.colorSpace = THREE.SRGBColorSpace;
        //this.texture.repeat.set(1, 1);

        this.mountainTexture = new THREE.TextureLoader().load("Model/Heightmap/mountain.jpg");
        this.mountainTexture.wrapS = THREE.RepeatWrapping;
        this.mountainTexture.wrapT = THREE.RepeatWrapping;
        this.mountainTexture.colorSpace = THREE.SRGBColorSpace;
        //this.mountainTexture.repeat.set(16, 16);

        this.factoryTexture = new THREE.TextureLoader().load("Model/Heightmap/factory.jpg");
        this.factoryTexture.wrapS = THREE.RepeatWrapping;
        this.factoryTexture.wrapT = THREE.RepeatWrapping;
        this.factoryTexture.colorSpace = THREE.SRGBColorSpace;

        this.cityTexture = new THREE.TextureLoader().load("Model/Heightmap/city.jpg");
        this.cityTexture.wrapS = THREE.RepeatWrapping;
        this.cityTexture.wrapT = THREE.RepeatWrapping;
        this.cityTexture.colorSpace = THREE.SRGBColorSpace;

        this.desertTexture = new THREE.TextureLoader().load("Model/Heightmap/desert.jpg");
        this.desertTexture.wrapS = THREE.RepeatWrapping;
        this.desertTexture.wrapT = THREE.RepeatWrapping;
        this.desertTexture.colorSpace = THREE.SRGBColorSpace;

        // 아래 3종은 내장 셰이더(SpriteMaterial / MeshBasicMaterial)를 통해 그려진다.
        // 내장 셰이더는 출력 sRGB 인코딩을 이미 하므로, 태그만 붙이면 디코딩까지 짝이 맞는다.
        // (스플래팅 텍스처 5종은 커스텀 셰이더라 인코딩이 없다 — 페이즈 2에서 함께 처리)
        this.fogTexture = new THREE.TextureLoader().load("Model/fog/fog.png");
        this.fogTexture.wrapS = THREE.RepeatWrapping;
        this.fogTexture.wrapT = THREE.RepeatWrapping;
        this.fogTexture.colorSpace = THREE.SRGBColorSpace;

        this.cloudTexture = new THREE.TextureLoader().load("Model/Cloud/cloud3.png");
        this.cloudTexture.wrapS = THREE.RepeatWrapping;
        this.cloudTexture.wrapT = THREE.RepeatWrapping;
        this.cloudTexture.colorSpace = THREE.SRGBColorSpace;

        this.missileFlameTexture = new THREE.TextureLoader().load("Model/MissileFlame/MissileFlame.png");
        this.missileFlameTexture.wrapS = THREE.RepeatWrapping;
        this.missileFlameTexture.wrapT = THREE.RepeatWrapping;
        this.missileFlameTexture.colorSpace = THREE.SRGBColorSpace;

    }

    static getInstance()
    {
        if (!ShaderManager.instance) {
            ShaderManager.instance = new ShaderManager;
        }
        return ShaderManager.instance;
    }

    public BuildMotionBlurShader()
    {
        const renderer = WorldManager.getInstance().Renderer;
        const sceneInstance = SceneManager.getInstance().SceneInstance;
        const camera = WorldManager.getInstance().MainCamera.CameraInstance;

        const canvas = WorldManager.getInstance().Canvas;

        //Post-processing
        this.composer = new EffectComposer(renderer);

        //renderer pass
        this.renderPass = new RenderPass(sceneInstance, camera)

        this.renderTargetParameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            stencilBuffer: false
        };

        // save pass
        this.savePass = new SavePass(
            new THREE.WebGLRenderTarget(
                canvas.clientWidth,
                canvas.clientHeight,
                this.renderTargetParameters
            )
        );

        // blend pass
        this.blendPass = new ShaderPass(BlendShader, "tDiffuse1");
        this.blendPass.uniforms["tDiffuse2"].value = this.savePass.renderTarget.texture;
        this.blendPass.uniforms["mixRatio"].value = 0.0;
        //this.blendPass.uniforms["mixRatio"].value = 0.3;

        // output pass
        this.outputPass = new ShaderPass(CopyShader);
        //this.outputPass.renderToScreen = true;

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.blendPass);
        this.composer.addPass(this.savePass);
        this.composer.addPass(this.outputPass);
        this.composer.renderToScreen = true;
    }

    public get SplattingShader()
    {
        return this.splattingShader;
    }

    public ShadedRender()
    {
        this.composer.render();
    }

    public farmTexture: THREE.Texture;
    public mountainTexture: THREE.Texture;
    public factoryTexture: THREE.Texture;
    public cityTexture: THREE.Texture;
    public fogTexture: THREE.Texture;
    public desertTexture: THREE.Texture;
    public cloudTexture: THREE.Texture;
    public missileFlameTexture: THREE.Texture;

    private composer: EffectComposer;
    private renderPass: RenderPass;
    private savePass: SavePass;
    private blendPass: ShaderPass;
    private outputPass: ShaderPass;

    private splattingShader: SplattingShader;

    private renderTargetParameters;
}
