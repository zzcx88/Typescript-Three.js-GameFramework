import { AircraftObject } from './AircraftObject';
import { CameraManager } from '../../Manager/CameraManager';
import { CameraMode, KeyState, ObjectType } from '../../enum';
import { CollisionComponent } from '../../Component/CollisionComponent';
import { GraphicComponent } from '../../Component/GraphicComponent';
import { InputManager } from '../../Manager/InputManager';
import { ObjectManager } from '../../Manager/ObjectManager';
import { PhysicsComponent } from '../../Component/PhysicsComponent';


export class F16Object extends AircraftObject
{
    constructor()
    {
        super();
        this.type = ObjectType.OBJ_AIRCRAFT;

        this.physicsComponent = new PhysicsComponent(this);
        this.graphicComponent = new GraphicComponent(this);
        this.collisionComponent = new CollisionComponent(this);
    }

    public InitializeAfterLoad()
    {
        this.GameObjectInstance.matrixAutoUpdate = true;

        this.GameObjectInstance.name = this.name;

        if (this.IsClone == false)
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        else
            this.CreateCollider();
    }

    public CreateCollider()
    {
        this.CollisionComponent.CreateBoundingBox(1, 1, 1);
        this.CollisionComponent.CreateRaycaster();
    }

    public CollisionActive()
    {
    }

    public CollisionDeActive()
    {
    }

    public Animate()
    {
        if (this.isClone == true) {
            this.CollisionComponent.Update();
        }

        if (this.IsPlayer == true) {
            this.PhysicsComponent.MoveForward(15);

            if (InputManager.getInstance().GetKeyState('left', KeyState.KEY_PRESS)) {
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
            }
            if (InputManager.getInstance().GetKeyState('right', KeyState.KEY_PRESS)) {
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
            }
            if (InputManager.getInstance().GetKeyState('down', KeyState.KEY_PRESS)) {
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
            }
            if (InputManager.getInstance().GetKeyState('up', KeyState.KEY_PRESS)) {
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
            }
            if (InputManager.getInstance().GetKeyState('w', KeyState.KEY_PRESS)) {
                //this.PhysicsComponent.MoveForward(15);
                this.throttle += 2;
            }
            if (InputManager.getInstance().GetKeyState('f', KeyState.KEY_DOWN)) {
                CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_3RD);
            }
            if (InputManager.getInstance().GetKeyState('r', KeyState.KEY_DOWN)) {
                CameraManager.getInstance().SetCameraSavedPosition(CameraMode.CAMERA_ORBIT);
            }
        }
    }
}
