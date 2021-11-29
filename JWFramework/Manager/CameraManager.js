var JWFramework;
(function (JWFramework) {
    class CameraManager {
        static getInstance() {
            if (!CameraManager.instance) {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }
        get CameraMode() {
            return this.cameraMode;
        }
        SetCameraSavedPosition() {
            this.cameraMode = JWFramework.CameraMode.CAMERA_3RD;
            let gameObject = JWFramework.ObjectManager.getInstance().GetObjectFromName("F-16");
            gameObject.GameObjectInstance.add(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObject.PhysicsComponent.GetPosition());
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);
            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Up.x * 3, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Up.y * 3, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Up.z * 3);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Look.x * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Look.y * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Look.z * -13);
            //WorldManager.getInstance().MainCamera.Animate();
        }
    }
    JWFramework.CameraManager = CameraManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CameraManager.js.map