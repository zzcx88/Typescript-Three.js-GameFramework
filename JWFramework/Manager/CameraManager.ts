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

            WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition().x,
                gameObjectForCamera.PhysicsComponent.GetPosition().y + 1.5, gameObjectForCamera.PhysicsComponent.GetPosition().z);

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);

            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Up.x * 0.6,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Up.y * 0.6,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Up.z * 0.6
            );

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Look.x * -3.7,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Look.y * -3.7,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Look.z * -3.7
            );
            //WorldManager.getInstance().MainCamera.Animate();
        }


        private ChangeOrbitCamera()
        {
            this.cameraMode = CameraMode.CAMERA_ORBIT;
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = true;
            let tartgetLocation: THREE.Vector3 = new THREE.Vector3;
            let gameObjectForCamera = SceneManager.getInstance().CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.remove(WorldManager.getInstance().MainCamera.CameraInstance);
            //WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
            //    gameObjectForCamera.PhysicsComponent.GetPosition().x,
            //    gameObjectForCamera.PhysicsComponent.GetPosition().y + 20,
            //    gameObjectForCamera.PhysicsComponent.GetPosition().z
            //);
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.object.position.x = gameObjectForCamera.PhysicsComponent.GetPosition().x;
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.object.position.y = gameObjectForCamera.PhysicsComponent.GetPosition().y + 15;
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.object.position.z = gameObjectForCamera.PhysicsComponent.GetPosition().z;
            SceneManager.getInstance().CurrentScene.Picker.OrbitControl.target = tartgetLocation.copy(gameObjectForCamera.PhysicsComponent.GetPosition());
            WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
        }
        private cameraMode: CameraMode;
    }
}