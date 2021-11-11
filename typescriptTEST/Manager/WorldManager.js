var JWFramework;
(function (JWFramework) {
    var WorldManager = /** @class */ (function () {
        function WorldManager() {
        }
        WorldManager.getInstance = function () {
            if (!WorldManager.instance) {
                WorldManager.instance = new WorldManager;
            }
            return WorldManager.instance;
        };
        WorldManager.prototype.InitializeWorld = function () {
            this.CreateRendere();
            this.ResizeView();
            this.CreateMainCamera();
            this.CreateScene();
            this.CreateDeltaTime();
        };
        WorldManager.prototype.CreateRendere = function () {
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector("#c"),
                alpha: true,
                clearAlpha: 0,
                clearColor: 0x000000,
                devicePixelRatio: 0,
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
            this.renderer.setFaceCulling(THREE.CullFaceBack);
            document.body.appendChild(this.renderer.domElement);
        };
        WorldManager.prototype.ResizeView = function () {
            var width = this.Canvas.clientWidth;
            var height = this.Canvas.clientHeight;
            var needResize = this.Canvas.width !== width || this.Canvas.height !== height;
            if (needResize) {
                this.renderer.setSize(width, height, false);
            }
            return needResize;
            //this.renderer.setSize(Define.SCREEN_WIDTH, Define.SCREEN_HEIGHT);
        };
        WorldManager.prototype.CreateMainCamera = function () {
            this.camera = new JWFramework.Camera();
            this.camera.Fov = 75;
            this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
            this.camera.Near = 0.1;
            this.camera.Far = 1000;
            this.camera.PhysicsComponent.SetPostion(0, 0, 2);
        };
        WorldManager.prototype.CreateScene = function () {
            this.sceneManager = JWFramework.SceneManager.getInstance();
            this.sceneManager.BuildScene();
            this.sceneManager.SceneInstance.background = new THREE.Color('blue');
        };
        WorldManager.prototype.CreateDeltaTime = function () {
            this.clock = new THREE.Clock();
            this.delta = 0;
        };
        WorldManager.prototype.Animate = function () {
            if (this.ResizeView()) {
                this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
                this.camera.CameraInstance.updateProjectionMatrix();
            }
            //this.camera.Animate();
            this.delta = this.clock.getDelta();
            this.sceneManager.Animate();
        };
        WorldManager.prototype.GetDeltaTime = function () {
            return this.delta;
        };
        Object.defineProperty(WorldManager.prototype, "Canvas", {
            get: function () {
                return this.renderer.domElement;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WorldManager.prototype, "MainCamera", {
            get: function () {
                return this.camera;
            },
            enumerable: false,
            configurable: true
        });
        WorldManager.prototype.Render = function () {
            this.renderer.render(this.sceneManager.SceneInstance, this.camera.CameraInstance);
        };
        return WorldManager;
    }());
    JWFramework.WorldManager = WorldManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=WorldManager.js.map