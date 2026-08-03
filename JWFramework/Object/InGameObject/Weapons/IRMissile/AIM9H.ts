import * as THREE from 'three';
import type { EditObject } from '../../../EditObject/EditObject';
import { Missile } from '../Missile';
import type { ObjectType } from '../../../../enum';


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
        this.rotateSpeedAcceleration = 5;
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

        const relativeSpeed = this.resultSpeed - (this.targetObject as EditObject).throttle;
        if (relativeSpeed > (this.targetObject as EditObject).throttle)
            this.endHomingStartLength = 100;
        else
            this.endHomingStartLength = 0;

        super.Animate();
    }
}
