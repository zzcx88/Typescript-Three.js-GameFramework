/// <reference path="../GameObject.ts" />
namespace JWFramework
{
    export class MissileFog extends GameObject
    {
        private mesh: THREE.Sprite;
        public material: THREE.SpriteMaterial;
        private fogLifeTime: number = 4;
        public currentTime: number = 0;

        constructor() {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            this.name = "MissileFog" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.CreateBillboardMesh();
        }

        public InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            //this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;

            //SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            //ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }

        private CreateBillboardMesh() {
            this.material = new THREE.SpriteMaterial({
                map: ShaderManager.getInstance().fogTexture,
                transparent: true,
                opacity: 0.8
            });
            this.mesh = new THREE.Sprite(this.material);
            this.GameObjectInstance = this.mesh;

            this.InitializeAfterLoad();
        }

        private *FogStateUpdate(): Generator<null, void, unknown>
        {
            this.currentTime += 5 * WorldManager.getInstance().GetDeltaTime();;
            this.physicsComponent.SetScaleScalar(this.currentTime);
            this.material.opacity -= 0.5 * WorldManager.getInstance().GetDeltaTime();
            if (this.material.opacity <= 0) {
                //this.isDead = true;
                (SceneManager.getInstance().CurrentScene as EditScene).missileFogPool.ReleaseObject(this);
                return;
            }
           yield;
        }

        public Reset()
        {
            ObjectManager.getInstance().DetachObject(this, this.type);
            this.currentTime = 0;
            this.material.opacity = 0.8;
            this.PhysicsComponent.SetScaleScalar(0.5);
            this.IsPoolObject = false;
        }

        public Animate() {
            let generator = this.FogStateUpdate();
            generator.next();
            //this.FogStateUpdate();
            //this.currentTime += 1 * WorldManager.getInstance().GetDeltaTime();;
            //this.physicsComponent.SetScaleScalar(this.currentTime);
            //this.material.opacity -= 0.1 * WorldManager.getInstance().GetDeltaTime();
            //if (this.material.opacity <= 0)
            //{
            //    //this.isDead = true;
            //    (SceneManager.getInstance().CurrentScene as EditScene).missileFogPool.ReleaseObject(this);
            //    return;
            //}
        }
    }
}