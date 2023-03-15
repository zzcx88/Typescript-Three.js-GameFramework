/// <reference path="../GameObject.ts" />
namespace JWFramework
{
    export class MissileFog extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            this.name = "MissileFog" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.CreateBillboardMesh();
        }

        public InitializeAfterLoad()
        {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }

        private CreateBillboardMesh()
        {
            this.material = new THREE.SpriteMaterial({
                map: ShaderManager.getInstance().fogTexture,
                transparent: true,
                opacity: 0.8
                //side: THREE.DoubleSide
            });
            this.mesh = new THREE.Sprite(this.material);
            this.GameObjectInstance = this.mesh;

            this.InitializeAfterLoad();
        }

        private *FogStateUpdate(): Generator<null, void, unknown>
        {
            this.currentTime += 1 * WorldManager.getInstance().GetDeltaTime();
            this.physicsComponent.SetScaleScalar(this.currentTime * 3);
            const material = (this.GameObjectInstance as THREE.Sprite).material;
            while (material.opacity >= 0)
            {
                material.opacity -= 0.2 * WorldManager.getInstance().GetDeltaTime();
                yield;
            }
            this.isDead = true;
            yield null;
        }

        public Animate()
        {
            let generator = this.FogStateUpdate();
            generator.next();
        }
        private mesh: THREE.Sprite;
        private material: THREE.SpriteMaterial;
        private fogLifeTime: number = 4;
        private currentTime: number = 0;
    }

}
