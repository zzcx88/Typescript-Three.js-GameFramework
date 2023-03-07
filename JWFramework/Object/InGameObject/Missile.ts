/// <reference path="../GameObject.ts" />
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
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;

            if (this.IsClone == false)
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
            {
                this.CreateCollider();
            }

            if (SceneManager.getInstance().SceneType == SceneType.SCENE_EDIT)
            {
                this.axisHelper = new THREE.AxesHelper(10);
                this.GameObjectInstance.add(this.axisHelper);
            }
        }

        public CreateCollider()
        {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(2,2,2));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }

        public CollisionActive()
        {
            if (this.activeColide == true)
                this.isDead = true;
        }

        public CollisionDeActive()
        {
        }
        public Animate()
        {
            if (this.makeObbTime > 0.5)
            {
                this.activeColide = true;
            }
            else
                this.makeObbTime += WorldManager.getInstance().GetDeltaTime();
            let targetObject = (ObjectManager.getInstance().GetObjectFromName("Target") as EditObject);
            if (targetObject != undefined)
            {
                let length = new THREE.Vector3().subVectors(targetObject.PhysicsComponent.GetPosition().clone(), this.PhysicsComponent.GetPosition().clone()).length();
                let targetDirection;

                //단거리
                /////////////////////////////
                if (length < 100)
                    this.distance = length - (length / 2);
                if (this.distance < 0)
                {
                    this.distance = 0;
                }

                //종말유도 테스트
                //if (length <= 50)
                //{
                //    if (this.rotaspeed < 50)
                //        this.rotaspeed += 20 * WorldManager.getInstance().GetDeltaTime();
                //    console.log(this.rotaspeed);
                //}
                /////////////////////////////

                //중장거리
                /////////////////////////////
                //this.distance = length - (length / 2);
                /////////////////////////////

                //초기유도 테스트
                //if (this.startGuidenceTime >= 0)
                //{
                //    this.rotaspeed = 0;
                //    this.startGuidenceTime -= 5 * WorldManager.getInstance().GetDeltaTime();
                //}
                //else
                //if (this.rotaspeed < 15)
                //this.rotaspeed = 10 /** WorldManager.getInstance().GetDeltaTime();*/

                let nextPos = targetObject.PhysicsComponent.GetPosition().clone().add(targetObject.PhysicsComponent.Look.clone().multiplyScalar(this.distance));
                targetDirection = new THREE.Vector3().subVectors(nextPos/*targetObject.PhysicsComponent.GetPosition().clone()*/, this.PhysicsComponent.GetPosition().clone()).normalize(); // 목표 방향
                const currentDirection = new THREE.Vector3(0, 0, 1).applyEuler(this.PhysicsComponent.GetRotateEuler()); // 현재 방향

                const angle = currentDirection.angleTo(targetDirection); // 현재 방향과 목표 방향 사이의 각도
                const axis = new THREE.Vector3().crossVectors(currentDirection, targetDirection).normalize(); // 회전 축

                let maxSpeed = this.rotaspeed;
                let maxRadius = this.angle;

                //에너지 손실
                //////////////////////////////////
                if (this.rotaspeed > 1)
                    this.rotaspeed -= 2 * WorldManager.getInstance().GetDeltaTime();
                if (this.rotaspeed < 1)
                    this.rotaspeed = 1;

                console.log(this.rotaspeed);

                let speed = maxSpeed * (angle / maxRadius); // 회전 속도
                speed = Math.min(speed, maxSpeed); // 최대 속도 제한


                const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, speed); // 회전 quaternion

                const currentRotation = new THREE.Quaternion();
                currentRotation.setFromEuler(this.PhysicsComponent.GetRotateEuler());
                const nextRotation = new THREE.Euler().setFromQuaternion(quaternion.multiply(currentRotation)); // 다음 회전

                this.GameObjectInstance.setRotationFromEuler(nextRotation);

                this.PhysicsComponent.MoveFoward(120);
            }
            else
                this.PhysicsComponent.MoveFoward(120);


            //미사일 연기 테스트
            let labelMaterial = new THREE.SpriteMaterial({
                map: ShaderManager.getInstance().fogTexture,
                transparent: true,
            });
            let fog = new THREE.Sprite(labelMaterial);
            fog.position.set(this.PhysicsComponent.GetPosition().x + Math.random() * 3, this.PhysicsComponent.GetPosition().y + Math.random() * 3, this.PhysicsComponent.GetPosition().z);
            fog.scale.set(3, 3, 3);
            SceneManager.getInstance().SceneInstance.add(fog);
            if (this.isClone == true)
            {
                this.CollisionComponent.Update();
            }
        }
        public currentVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        private rotaspeed: number = 15;
        private angle: number = 500;
        private distance: number = 100;
        private startGuidenceTime = 6;
        private makeObbTime = 0;
        private activeColide = false;
        private axisHelper: THREE.AxesHelper;
    }
    
}
