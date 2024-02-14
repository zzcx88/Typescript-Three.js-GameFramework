/// <reference path=".././../GameObject.ts" />
namespace JWFramework
{
    export class Water extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_WATER;
            this.name = "Water"
        }

        public InitializeAfterLoad()
        {
            if (this.IsClone == true)
            {
                this.graphicComponent = new GraphComponent(this);
                this.physicsComponent = new PhysicsComponent(this);
                this.exportComponent = new ExportComponent(this);
                this.CreateWaterMesh();
                this.GameObjectInstance.matrixAutoUpdate = true;
                this.GameObjectInstance.name = this.name;
            }
            else
            {
                ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            }
        }

        private CreateWaterMesh()
        {
            this.geometry = new THREE.PlaneGeometry(900, 900, 4, 4);
            this.mesh = new THREE.Water(
                this.geometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: new THREE.TextureLoader().load('Object/InGameObject/Envirument/waternormals.jpg', function (texture)
                    {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    }),
                    sunDirection: new THREE.Vector3(1, 1, 0),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 2,
                    fog: true
                }
            );

            this.mesh.name = "WaterMesh";
            this.mesh.rotation.x = -Math.PI / 2;
            this.GameObjectInstance = this.mesh;
        }

        public Animate()
        {
            this.mesh.material.uniforms['time'].value += 1 * WorldManager.getInstance().GetDeltaTime();
        }
        private geometry: THREE.BufferGeometry;
        private mesh: THREE.Water;
    }

}
