var JWFramework;
(function (JWFramework) {
    class TestScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super();
            this.sceneManager = sceneManager;
            this.light = new JWFramework.Light();
            this.BuildObject();
            this.BuildLight();
            this.SetPicker();
        }
        BuildObject() {
            JWFramework.HeightmapTerrain.FromImage().then(function (terrain) {
                terrain.CreateTerrainMesh();
                JWFramework.SceneManager.getInstance().CurrentScene.Terrain = terrain;
            });
            JWFramework.ModelLoadManager.getInstance().LoadSceneTest();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 3;
            this.light.GameObjectInstance.position.set(0, 30, 0);
            this.sceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                let gameObject = JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16");
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
                if (JWFramework.InputManager.getInstance().GetKeyState('f')) {
                    console.log(JWFramework.SceneManager.getInstance().CurrentScene.Terrain.GetHeight(JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().x, JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition().z));
                    console.log(JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16").PhysicsComponent.GetPosition());
                }
                JWFramework.SceneManager.getInstance().CurrentScene.Terrain;
            }
        }
    }
    JWFramework.TestScene = TestScene;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=TestScene.js.map