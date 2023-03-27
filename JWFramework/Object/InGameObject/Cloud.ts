/// <reference path="../GameObject.ts" />
namespace JWFramework
{
    export class Cloud extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            //this.name = "cloud" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.graphicComponent = new GraphComponent(this);
            this.isClone = false;
        }

        public BuildClouds()
        {
            this.CreateBillboardMesh();
        }

        public InitializeAfterLoad()
        {
            if (this.IsClone == true)
            {
                this.BuildClouds();
                this.GameObjectInstance.matrixAutoUpdate = true;
                //this.PhysicsComponent.SetScaleScalar(1);
                this.GameObjectInstance.name = this.name;
            }
            else
            {
                //SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            }
        }

        private SetMaterial(mesh)
        {
            (mesh).traverse(node =>
            {
                if (node.isMesh || node.isGroup || node.isSprite)
                {
                    node.name = "CloudCloneNode";
                    if (node.geometry)
                    {
                        node.material.color = new THREE.Color(0.45, 0.45, 0.45);
                        node.material.fog = false;
                        node.material.transparent = true;
                        node.material.opacity = 0.9;
                        node.material.alphaTest = 0.01;
                        console.log(node.material.alphaTest);
                        node.material.depthWrite = false;
                        node.material.side = THREE.DoubleSide;
                        //node.material.wireframe = true;
                        //node.material.blending = THREE.AdditiveBlending;
                    };
                }
            });
        }

        private CreateBillboardMesh()
        {
            this.mesh = new THREE.Mesh();
            const positions: THREE.Vector3[] = [];

            for (let i = 0; i < 30; ++i)
            {
                const scale = new THREE.Vector3(
                    1000 + Math.random() * 1600,
                    500 + Math.random() * 1000,
                    1000 + Math.random() * 1600
                );

                const position = new THREE.Vector3();
                do
                {
                    position.set(
                        -10000 + Math.random() * 20000,
                        200 + Math.random() * 600,
                        -5000 + Math.random() * 20000
                    );
                } while (positions.some(p => p.distanceTo(position) < Math.max(scale.x, scale.z)));

                let childMesh: THREE.Mesh = ObjectManager.getInstance().GetObjectFromName("Cloud").GameObjectInstance.clone();
                childMesh.name = "CloudCloneChild";
                this.SetMaterial(childMesh);
                childMesh.position.set(position.x, position.y, position.z);
                childMesh.scale.set(scale.x, scale.y, scale.z);
                childMesh.rotateY(Math.random() * 360);
                childMesh.renderOrder = -1;
                this.mesh.add(childMesh);

                positions.push(position);
            }
            this.mesh.name = "CloudCloneMesh";
            this.GameObjectInstance = this.mesh;
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }



        public Animate()
        {
        }
        private geometry: THREE.BufferGeometry;
        private mesh: THREE.Mesh;
        private material: THREE.MeshStandardMaterial;
        private positions: THREE.Vector3[] = [];
        private scales: THREE.Vector3[] = [];
        private prevMatrix: THREE.Matrix4[] = [];
    }

}
