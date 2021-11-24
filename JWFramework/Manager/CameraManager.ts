namespace JWFramework {
    export class CameraManager {

        private static instance: CameraManager;

        static getInstance() {
            if (!CameraManager.instance) {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }

        public SetCameraSavedPosition() {
            let gameObject = ObjectManager.getInstance().GetObjectFromName("F-16");
            gameObject.GameObjectInstance.add(WorldManager.getInstance().MainCamera.CameraInstance);

                WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(0, 0, 0);

                WorldManager.getInstance().MainCamera.Animate();

                WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Up.x * 3,
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Up.y * 3,
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Up.z * 3
                );

                WorldManager.getInstance().MainCamera.PhysicsComponent.SetPostion(
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().x + gameObject.PhysicsComponent.Look.x * -13,
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().y + gameObject.PhysicsComponent.Look.y * -13,
                    WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().z + gameObject.PhysicsComponent.Look.z * -13
                );
        }
    }
}