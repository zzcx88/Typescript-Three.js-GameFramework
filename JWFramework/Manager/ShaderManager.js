var JWFramework;
(function (JWFramework) {
    class ShaderManager {
        constructor() {
            this.BuildMotuinBlurShader();
        }
        static getInstance() {
            if (!ShaderManager.instance) {
                ShaderManager.instance = new ShaderManager;
            }
            return ShaderManager.instance;
        }
        BuildMotuinBlurShader() {
            let renderer = JWFramework.WorldManager.getInstance().Renderer;
            let sceneInstance = JWFramework.SceneManager.getInstance().SceneInstance;
            let camera = JWFramework.WorldManager.getInstance().MainCamera.CameraInstance;
            let canvas = JWFramework.WorldManager.getInstance().Canvas;
            this.composer = new THREE.EffectComposer(renderer);
            this.renderPass = new THREE.RenderPass(sceneInstance, camera);
            this.renderTargetParameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                stencilBuffer: false
            };
            this.savePass = new THREE.SavePass(new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, this.renderTargetParameters));
            this.blendPass = new THREE.ShaderPass(THREE.BlendShader, "tDiffuse1");
            this.blendPass.uniforms["tDiffuse2"].value = this.savePass.renderTarget.texture;
            this.blendPass.uniforms["mixRatio"].value = 0.75;
            this.outputPass = new THREE.ShaderPass(THREE.CopyShader);
            this.composer.addPass(this.renderPass);
            this.composer.addPass(this.blendPass);
            this.composer.addPass(this.savePass);
            this.composer.addPass(this.outputPass);
            this.composer.renderToScreen = true;
        }
        ShadedRender() {
            this.composer.render();
        }
    }
    JWFramework.ShaderManager = ShaderManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ShaderManager.js.map