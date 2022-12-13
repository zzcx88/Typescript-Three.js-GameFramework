declare namespace JWFramework {
    class ShaderManager {
        private static instance;
        constructor();
        static getInstance(): ShaderManager;
        BuildMotuinBlurShader(): void;
        ShadedRender(): void;
        private composer;
        private renderPass;
        private savePass;
        private blendPass;
        private outputPass;
        private renderTargetParameters;
    }
}
