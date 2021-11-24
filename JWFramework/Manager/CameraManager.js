var JWFramework;
(function (JWFramework) {
    class CameraManager {
        static getInstance() {
            if (!CameraManager.instance) {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }
        SetCameraSavedPosition() {
            let gameObject = JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16");
            gameObject.GameObjectInstance.add(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);
            JWFramework.WorldManager.getInstance().MainCamera.Animate();
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Up.x * 3, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Up.y * 3, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Up.z * 3);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Look.x * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Look.y * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Look.z * -13);
        }
    }
    JWFramework.CameraManager = CameraManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CameraManager.js.map