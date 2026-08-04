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

        // 유도 파라미터는 목표가 있을 때만 의미가 있다.
        // 베이스 Animate() 는 targetObject 부재를 정상 상태로 다뤄 직선 비행으로 넘어가는데,
        // 여기서 먼저 읽어버리면 그 경로에 닿기 전에 터졌다. ROADMAP P1-B
        if (this.targetObject != undefined)
        {
            const relativeSpeed = this.resultSpeed - (this.targetObject as EditObject).throttle;
            if (relativeSpeed > (this.targetObject as EditObject).throttle)
                this.endHomingStartLength = 50;
            else
                this.endHomingStartLength = 0;
        }

        super.Animate();
    }
}
