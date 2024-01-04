/// <reference path="../GameObject.ts" />
namespace JWFramework
{
    export class IRCircle extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            this.name = "Ircircle" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.CreateMesh();
        }

        public InitializeAfterLoad()
        {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }

        private CreateMesh()
        {
            this.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setColorName("Red"),
                transparent: true,
                side: THREE.DoubleSide,
                depthTest : false
            });
            this.geometry = new THREE.RingGeometry(1, 1, 32);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.GameObjectInstance = this.mesh;

            this.InitializeAfterLoad();
        }

        public Animate()
        {

        }
        private mesh: THREE.Mesh;
        private material: THREE.MeshBasicMaterial;
        private geometry: THREE.RingGeometry;
        private player: GameObject;
    }

}
