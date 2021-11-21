namespace JWFramework {
    export class TestScene extends SceneBase {
        constructor(sceneManager: SceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new Light();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }

        private BuildObject() {
            HeightmapTerrain.FromImage().then(function (terrain: HeightmapTerrain) {
                terrain.CreateTerrainMesh();
                SceneManager.getInstance().CurrentScene.Terrain = terrain;
            });
            ModelLoadManager.getInstance().LoadSceneTest();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }

        private BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(0,  30, 0);

            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }

        public Animate() {
            if (ModelLoadManager.getInstance().LoadComplete == true) {
                ObjectManager.getInstance().Animate();
                let gameObject = ObjectManager.getInstance().GetObjectFromName("F-16");

                //WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                //    0,
                //    0,
                //    0
                //);

                //WorldManager.getInstance().MainCamera.Animate();

                //WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Up.x * 3,
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Up.y * 3,
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Up.z * 3
                //);

                //WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Look.x * -13,
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Look.y * -13,
                //    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Look.z * -13
                //);

                if (InputManager.getInstance().GetKeyState('f')) {
                    console.log(SceneManager.getInstance().CurrentScene.Terrain.GetHeight(ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().x,
                        ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().z));
                    console.log(ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition());
                }

                SceneManager.getInstance().CurrentScene.Terrain
            }
        }
        private sceneManager: SceneManager
        private light: Light;
    }
}
