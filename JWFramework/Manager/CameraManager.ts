namespace JWFramework
{
    export class CameraManager
    {

        private static instance: CameraManager;

        static getInstance()
        {
            if (!CameraManager.instance)
            {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }

        public get CameraMode(): CameraMode
        {
            return this.cameraMode;
        }

        public SetCameraSavedPosition(cameraMode: CameraMode)
        {
            switch (cameraMode)
            {
                case CameraMode.CAMERA_3RD:
                    this.ChangeThridPersonCamera();
                    break;
                case CameraMode.CAMERA_ORBIT:
                    this.ChangeOrbitCamera();
                    break;

            }
        }

        private ChangeThridPersonCamera()
        {
            this.cameraMode = CameraMode.CAMERA_3RD;

            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = false;

            let gameObjectForCamera = SceneManager.getInstance().CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.add(WorldManager.getInstance().MainCamera.CameraInstance);

            WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition().x, gameObjectForCamera.PhysicsComponent.GetPosition().y + 1.5, gameObjectForCamera.PhysicsComponent.GetPosition().z);

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);

            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Up.x * 1.5,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Up.y * 1.5,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Up.z * 1.5
            );

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Look.x * -4.8,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Look.y * -4.8,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Look.z * -4.8
            );
            //WorldManager.getInstance().MainCamera.Animate();
        }


        private ChangeOrbitCamera()
        {
            this.cameraMode = CameraMode.CAMERA_ORBIT;
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = true;
            let gameObjectForCamera = SceneManager.getInstance().CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.remove(WorldManager.getInstance().MainCamera.CameraInstance);
            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                gameObjectForCamera.PhysicsComponent.GetPosition().x,
                gameObjectForCamera.PhysicsComponent.GetPosition().y + 20,
                gameObjectForCamera.PhysicsComponent.GetPosition().z
            );
            WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
        }
        private cameraMode: CameraMode;
    }
}