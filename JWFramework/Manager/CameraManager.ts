namespace JWFramework {
    export class CameraManager {

        private static instance: CameraManager;

        static getInstance() {
            if (!CameraManager.instance) {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }

        public get CameraMode(): CameraMode {
            return this.cameraMode;
        }

        public SetCameraSavedPosition() {
            this.cameraMode = CameraMode.CAMERA_3RD;

            let gameObject = ObjectManager.getInstance().GetObjectFromName("F-16");
            gameObject.GameObjectInstance.add(WorldManager.getInstance().MainCamera.CameraInstance);

            WorldManager.getInstance().MainCamera.CameraInstance.lookAt(gameObject.PhysicsComponent.GetPosition());

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);

            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Up.x * 3,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Up.y * 3,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Up.z * 3
                );

            WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + Look.x * -13,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + Look.y * -13,
                WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + Look.z * -13
            );
            //WorldManager.getInstance().MainCamera.Animate();

        }

        private cameraMode: CameraMode;
    }
}