import type { EditObject } from '../../../EditObject/EditObject';
import { Missile } from '../Missile';
import type { ObjectType } from '../../../../enum';


export class R60M extends Missile
{
    constructor()
    {
        super();
    }

    public InitializeAfterLoad()
    {
        super.InitializeAfterLoad();

        this.velocityGain = 30;
        this.velocityBreak = 2;
        this.maxVelocity = 80;
        this.maxRotateSpeed = 30;
        this.rotateSpeedAcceleration = 20;
    }

    public CreateCollider()
    {
        this.CollisionComponent.CreateBoundingSphere(this.physicsComponent.GetPosition(), 2);
        this.CollisionComponent.CreateRaycaster();
        //this.CollisionComponent.ObbBoxHelper.visible = false;
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

        const relativeSpeed = this.resultSpeed - (this.targetObject as EditObject).throttle;
        if (relativeSpeed > (this.targetObject as EditObject).throttle)
            this.endHomingStartLength = 50;
        else
            this.endHomingStartLength = 0;

        super.Animate();
    }
}
