/// <reference path="../../Weapons/Missile.ts" />
namespace JWFramework
{
    export class AIM9H extends Missile
    {
        constructor()
        {
            super();
        }

        public InitializeAfterLoad()
        {
            super.InitializeAfterLoad();

            this.velocityGain = 40;
            this.velocityBreak = 1;
            this.maxVelocity = 80;
            this.maxRotateSpeed = 18;
            this.rotateSpeedAcceletion = 5;
        }

        public CreateCollider()
        {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }

        public CollisionActive(type: ObjectType)
        {
            super.CollisionActive(type);
        }

        public CollisionDeActive()
        {
        }
        public Animate()
        {
            if (this.maxResultSpeed == 0)
                this.maxResultSpeed = this.maxVelocity + this.AirCraftSpeed;

            let reletiveSpeed = this.resultSpeed - (this.targetObject as EditObject).throttle;
            if (reletiveSpeed > (this.targetObject as EditObject).throttle)
                this.endHomingStartLenge = 100;
            else
                this.endHomingStartLenge = 0;

            super.Animate();
        }
    }

}
