var JWFramework;
(function (JWFramework) {
    class WorldManager {
        constructor() { }
        static getInstance() {
            if (!WorldManager.instance) {
                WorldManager.instance = new WorldManager;
            }
            return WorldManager.instance;
        }
        InitializeWorld() {
            this.CreateRendere();
            this.ResizeView();
            this.CreateMainCamera();
            this.CreateScene();
            this.CreateDeltaTime();
        }
        CreateRendere() {
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector("#c"),
                alpha: true,
                antialias: false,
                precision: "highp",
                premultipliedAlpha: true,
                stencil: true,
                preserveDrawingBuffer: false,
                logarithmicDepthBuffer: false
            });
            this.renderer.setViewport(0, 0, JWFramework.Define.SCREEN_WIDTH, JWFramework.Define.SCREEN_HEIGHT);
            this.renderer.setScissor(0, 0, 0, 0);
            this.renderer.setClearColor(0x000000);
            document.body.appendChild(this.renderer.domElement);
        }
        ResizeView() {
            const width = this.Canvas.clientWidth;
            const height = this.Canvas.clientHeight;
            const needResize = this.Canvas.width !== width || this.Canvas.height !== height;
            if (needResize) {
                this.renderer.setSize(width, height, false);
            }
            return needResize;
            //this.renderer.setSize(Define.SCREEN_WIDTH, Define.SCREEN_HEIGHT);
        }
        CreateMainCamera() {
            this.camera = new JWFramework.Camera();
            this.camera.Fov = 75;
            this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
            this.camera.Near = 0.1;
            this.camera.Far = 1000;
            this.camera.PhysicsComponent.SetPostion(0, 22, 0);
            //this.camera.CameraInstance.position.z = 2;
        }
        CreateScene() {
            this.sceneManager = JWFramework.SceneManager.getInstance();
            this.sceneManager.BuildScene();
            this.sceneManager.SceneInstance.background = new THREE.Color('gray');
        }
        CreateDeltaTime() {
            this.clock = new THREE.Clock();
            this.delta = 0;
        }
        Animate() {
            if (this.ResizeView()) {
                this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
                this.camera.CameraInstance.updateProjectionMatrix();
            }
            //this.camera.Animate();
            this.delta = this.clock.getDelta();
            this.sceneManager.Animate();
        }
        GetDeltaTime() {
            return this.delta;
        }
        get Canvas() {
            return this.renderer.domElement;
        }
        get MainCamera() {
            return this.camera;
        }
        Render() {
            this.renderer.render(this.sceneManager.SceneInstance, this.camera.CameraInstance);
        }
    }
    JWFramework.WorldManager = WorldManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=WorldManager.js.map