/// <reference path="../../JWFramework/Shader/SplettingShader.ts" />
namespace JWFramework
{
    export class ShaderManager
    {

        private static instance: ShaderManager;

        public constructor()
        {
            this.BuildMotuinBlurShader();
            this.splattingShader = new JWFramework.SplattingShader();

            this.farmTexture = new THREE.TextureLoader().load("Model/Heightmap/farm.jpg");
            this.farmTexture.wrapS = THREE.RepeatWrapping;
            this.farmTexture.wrapT = THREE.RepeatWrapping;
            //this.texture.repeat.set(1, 1);

            this.mountainTexture = new THREE.TextureLoader().load("Model/Heightmap/mountain.jpg");
            this.mountainTexture.wrapS = THREE.RepeatWrapping;
            this.mountainTexture.wrapT = THREE.RepeatWrapping;
            //this.mountainTexture.repeat.set(16, 16);

            this.factoryTexture = new THREE.TextureLoader().load("Model/Heightmap/factory.jpg");
            this.factoryTexture.wrapS = THREE.RepeatWrapping;
            this.factoryTexture.wrapT = THREE.RepeatWrapping;

        }

        static getInstance()
        {
            if (!ShaderManager.instance) {
                ShaderManager.instance = new ShaderManager;
            }
            return ShaderManager.instance;
        }

        public BuildMotuinBlurShader()
        {
            let renderer = WorldManager.getInstance().Renderer;
            let sceneInstance = SceneManager.getInstance().SceneInstance;
            let camera = WorldManager.getInstance().MainCamera.CameraInstance;

            let canvas = WorldManager.getInstance().Canvas;

            //Post-processing
            this.composer = new THREE.EffectComposer(renderer);

            //renderer pass
            this.renderPass = new THREE.RenderPass(sceneInstance, camera)

            this.renderTargetParameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                stencilBuffer: false
            };

            // save pass
            this.savePass = new THREE.SavePass(
                new THREE.WebGLRenderTarget(
                    canvas.clientWidth,
                    canvas.clientHeight,
                    this.renderTargetParameters
                )
            );

            // blend pass
            this.blendPass = new THREE.ShaderPass(THREE.BlendShader, "tDiffuse1");
            this.blendPass.uniforms["tDiffuse2"].value = this.savePass.renderTarget.texture;
            this.blendPass.uniforms["mixRatio"].value = 0.0;

            // output pass
            this.outputPass = new THREE.ShaderPass(THREE.CopyShader);
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

        private composer: THREE.EffectComposer;
        private renderPass: THREE.RenderPass;
        private savePass: THREE.SavePass;
        private blendPass: THREE.ShaderPass;
        private outputPass: THREE.ShaderPass;

        private splattingShader: SplattingShader;

        private renderTargetParameters;
    }
}