import * as THREE from 'three';
import { GameObject } from '../GameObject';
import { GraphicComponent } from '../../Component/GraphicComponent';
import { InputManager } from '../../Manager/InputManager';
import { ObjectType } from '../../enum';
import { PhysicsComponent } from '../../Component/PhysicsComponent';


export class TestCube extends GameObject
{
    constructor()
    {
        super();
        this.type = ObjectType.OBJ_OBJECT3D;
        this.physicsComponent = new PhysicsComponent(this);
        this.graphicComponent = new GraphicComponent(this);
    }

    public InitializeAfterLoad()
    {
        const axisY: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        this.PhysicsComponent.RotateVec3(axisY, 180);
    }

    public get PhysicsComponent(): PhysicsComponent
    {
        return this.physicsComponent;
    }

    public get GraphicComponent(): GraphicComponent
    {
        return this.graphicComponent;
    }

    public Animate()
    {
        //if (InputManager.getInstance().GetKeyState('left')) {
        //    this.y = -1;
        //    this.PhysicsComponent.Rotate(0, this.y, 0);
        //}
        //if (InputManager.getInstance().GetKeyState('right')) {
        //    this.y = 1;
        //    this.PhysicsComponent.Rotate(0, this.y, 0);
        //}
        //if (InputManager.getInstance().GetKeyState('up')) {
        //    this.PhysicsComponent.MoveForward(1);
        //}

    }

    private y: number = 0;
}
