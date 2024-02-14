/// <reference path="../../GameObject.ts" />
namespace JWFramework
{
    export class Missile extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_MISSILE;

            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.exportComponent = new ExportComponent(this);
            this.collisionComponent = new CollisionComponent(this);
        }

        public InitializeAfterLoad()
        {
            this.targetObject = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject);

            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
            {
                let flameMaterial = new THREE.SpriteMaterial({
                    map: ShaderManager.getInstance().missileFlameTexture,
                    transparent: true,
                    //side: THREE.DoubleSide
                });
                this.missileFlameMesh = new THREE.Sprite(flameMaterial);
                this.GameObjectInstance.add(this.missileFlameMesh);
                this.missileFlameMesh.scale.set(5, 5, 5);
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Look, -1.2)
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Right, -0.04)
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Up, 0.05)
                this.CreateCollider();
            }

            //if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT)
            //{
            //    this.axisHelper = new THREE.AxesHelper(10);
            //    this.GameObjectInstance.add(this.axisHelper);
            //}
        }

        public CreateCollider()
        {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }

        public CollisionActive(type: ObjectType = null)
        {
            if (type == ObjectType.OBJ_TERRAIN)
                this.activeColide = true;
            if (this.activeColide == true)
                this.isDead = true;
        }

        public CollisionDeActive()
        {
        }

        public get AirCraftSpeed()
        {
            return this.aircraftSpeed;
        }

        public set AirCraftSpeed(speed: number)
        {
            this.aircraftSpeed = speed;
        }
        public Animate()
        {
            this.isRayOn = true;
            if (this.targetObject != undefined)
            {
                let length = new THREE.Vector3().subVectors(this.targetObject.PhysicsComponent.GetPosition().clone(), this.PhysicsComponent.GetPosition().clone()).length();
                let targetDirection;


                //if (length < 100)
                //{
                    this.activeColide = true;
                //}
                

                //일반유도
                if (length >= this.endHomingStartLenge)
                {
                    this.predictionDistance = length - (length / 2);
                }
                else
                {
                    this.predictionDistance = 0;
                }

                //에너지 상승
                //////////////////////////////////
                if (this.rotaspeed < this.maxRotateSpeed)
                    this.rotaspeed += this.rotateSpeedAcceletion * WorldManager.getInstance().GetDeltaTime();
                else
                {
                    this.rotaspeed = this.maxRotateSpeed;
                }

                let nextPos = this.targetObject.PhysicsComponent.GetPosition().clone().add(this.targetObject.PhysicsComponent.Look.clone().multiplyScalar(this.predictionDistance));
                targetDirection = new THREE.Vector3().subVectors(nextPos/*targetObject.PhysicsComponent.GetPosition().clone()*/, this.PhysicsComponent.GetPosition().clone()).normalize(); // 목표 방향
                const currentDirection = new THREE.Vector3(0, 0, 1).applyEuler(this.PhysicsComponent.GetRotateEuler()); // 현재 방향

                const angle = currentDirection.angleTo(targetDirection); // 현재 방향과 목표 방향 사이의 각도
                const axis = new THREE.Vector3().crossVectors(currentDirection, targetDirection).normalize(); // 회전 축

                let maxSpeed = this.rotaspeed;
                let maxRadius = this.angle;

                let speed = maxSpeed * (angle / maxRadius); // 회전 속도
                speed = Math.min(speed, maxSpeed); // 최대 속도 제한


                const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, speed); // 회전 quaternion

                const currentRotation = new THREE.Quaternion();
                currentRotation.setFromEuler(this.PhysicsComponent.GetRotateEuler());
                const nextRotation = new THREE.Euler().setFromQuaternion(quaternion.multiply(currentRotation)); // 다음 회전

                this.GameObjectInstance.setRotationFromEuler(nextRotation);

                //가속도 제어
                //////////////////////////////
                if (this.deAcceleration == false && this.velocity <= this.maxVelocity)
                {
                    this.velocity += (this.velocityGain * WorldManager.getInstance().GetDeltaTime());
                    this.resultSpeed = this.aircraftSpeed + this.velocity;
                }
                else if (this.deAcceleration == false && this.maxResultSpeed <= this.resultSpeed)
                {
                    this.deAcceleration = true;
                    this.resultSpeed = this.maxResultSpeed;
                }
                if (this.deAcceleration == true)
                    this.resultSpeed -= (this.velocityBreak * WorldManager.getInstance().GetDeltaTime());
                if (this.resultSpeed <= 60)
                {
                    this.resultSpeed = this.maxVelocity;
                   // this.IsDead = true;
                }
                this.PhysicsComponent.MoveFoward(this.resultSpeed);
            }
            else
                this.PhysicsComponent.MoveFoward(120);

            //미사일 연기
            let missileFog = new MissileFog();
            missileFog.IsClone = true;
            missileFog.PhysicsComponent.SetPostion(this.PhysicsComponent.GetPosition().x + Math.random() * 3, this.PhysicsComponent.GetPosition().y + Math.random() * 3, this.PhysicsComponent.GetPosition().z);
            missileFog.PhysicsComponent.SetScale(0.5, 0.5, 0.5);

            if (this.isClone == true)
            {
                this.CollisionComponent.Update();
            }
        }
        protected targetObject: GameObject;

        protected aircraftSpeed: number = 0;
        protected velocity: number = 0;
        protected velocityGain: number = 0;
        protected velocityBreak: number = 0;
        protected maxVelocity: number = 80;
        protected maxResultSpeed: number = 0;
        protected resultSpeed: number = 0;

        protected rotaspeed: number = 0;

        //미사일 선회력
        protected maxRotateSpeed: number = 20;
        protected rotateSpeedAcceletion: number = 20;

        protected predictionDistance: number = 200;
        protected endHomingStartLenge: number = 0;
        protected angle: number = 500;

        protected activeColide = false;
        protected deAcceleration = false;
        protected axisHelper: THREE.AxesHelper;
        protected missileFlameMesh: THREE.Sprite;
    }

}
