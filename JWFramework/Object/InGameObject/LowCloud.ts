/// <reference path="../GameObject.ts" />

namespace JWFramework
{
    export class LowCloud extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            this.name = "cloud" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
        }

        public BuildClouds(x: number, y: number, z: number)
        {
            this.center = new THREE.Vector3(x, y, z);
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
            this.material = new THREE.MeshBasicMaterial({
                map: ShaderManager.getInstance().cloudTexture,
                color: new THREE.Color("white"),
                fog: false,
                transparent: true,
                alphaTest: 0.01,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.NormalBlending
            });

            let geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            this.mesh = new THREE.InstancedMesh(geometry, this.material, this.instanceCount);
            this.GameObjectInstance = this.mesh;

            //const center = new THREE.Vector3(0, 0, 0); // 중심점
            const radius = 800; // 범위 반지름
            const displacement = new THREE.Vector3(); // 이동 거리

            for (let i = 0; i < this.instanceCount; ++i)
            {
                const scale = new THREE.Vector3(
                    600 + Math.random() * 600,
                    300 + Math.random() * 300,
                    1
                );

                const position = new THREE.Vector3();
                const angle = Math.random() * Math.PI * 2; // 랜덤한 각도
                const distance = Math.random() * radius; // 랜덤한 거리
                position.set(
                    this.center.x + Math.sin(angle) * distance + displacement.x,
                    (this.center.y + 700) + Math.cos(angle) * (distance - 500) + displacement.y,
                    this.center.z + (Math.random() - 0.5) * 2 * displacement.z
                );

                // 불규칙한 이동 거리 설정
                displacement.x = (Math.random() - 0.5) * 2 * radius;
                displacement.y = (Math.random() - 0.5) * 0.1 * radius;
                displacement.z = (Math.random() - 0.5) * 2 * radius;

                // 포지션 값 저장
                this.positions.push(position);

                this.positions.push(position);
                this.scales.push(scale);
                let matrix = new THREE.Matrix4();
                matrix.scale(this.scales[i]);
                matrix.setPosition(position);
                this.prevMatrix[i] = matrix.clone();
            }

            this.InitializeAfterLoad();
        }

        public Animate()
        {
            let cameraPos = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
            if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
                WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPos);
            if (cameraPos.sub(this.center).length() > 6000)
            {
                this.GameObjectInstance.visible = false;
            }
            else
            {
                this.GameObjectInstance.visible = true;
            }
            if (this.GameObjectInstance.visible == true)
                for (let i = 0; i < this.instanceCount; ++i)
                {
                    let cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
                    if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
                        WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
                    let position = this.positions[i].clone();
                    let matrix = new THREE.Matrix4();
                    matrix.lookAt(position, cameraPosition, new THREE.Vector3(0, 1, 0));
                    matrix.scale(this.scales[i]);
                    matrix.setPosition(position);
                    if (cameraPosition.sub(position).length() > 1000)
                    {
                        this.mesh.setMatrixAt(i, matrix);
                        this.prevMatrix[i] = matrix.clone();
                    }
                    else
                        this.mesh.setMatrixAt(i, this.prevMatrix[i]);
                }
            this.mesh.instanceMatrix.needsUpdate = true;
        }

        private center: THREE.Vector3;
        private instanceCount: number = 200;
        private mesh: THREE.InstancedMesh;
        private material: THREE.MeshBasicMaterial;
        private positions: THREE.Vector3[] = [];
        private scales: THREE.Vector3[] = [];
        private prevMatrix: THREE.Matrix4[] = [];
    }

}
