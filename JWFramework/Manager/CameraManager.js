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
        SetCameraSavedPosition(cameraMode) {
            switch (cameraMode) {
                case JWFramework.CameraMode.CAMERA_3RD:
                    this.ChangeThridPersonCamera();
                    break;
                case JWFramework.CameraMode.CAMERA_ORBIT:
                    this.ChangeOrbitCamera();
                    break;
            }
        }
        ChangeThridPersonCamera() {
            this.cameraMode = JWFramework.CameraMode.CAMERA_3RD;
            JWFramework.SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = false;
            let gameObjectForCamera = JWFramework.SceneManager.getInstance().CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.add(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);
            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Up.x * 3.5, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Up.y * 3.5, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Up.z * 3.5);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Look.x * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Look.y * -13, JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Look.z * -13);
            //WorldManager.getInstance().MainCamera.Animate();
        }
        ChangeOrbitCamera() {
            this.cameraMode = JWFramework.CameraMode.CAMERA_ORBIT;
            JWFramework.SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = true;
            let gameObjectForCamera = JWFramework.SceneManager.getInstance().CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.remove(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(gameObjectForCamera.PhysicsComponent.GetPosition().x, gameObjectForCamera.PhysicsComponent.GetPosition().y + 20, gameObjectForCamera.PhysicsComponent.GetPosition().z);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
        }
    }
    JWFramework.CameraManager = CameraManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CameraManager.js.map