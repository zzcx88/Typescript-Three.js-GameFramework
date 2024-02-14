namespace JWFramework
{
    export class ExportComponent
    {
        constructor(gameObject: GameObject)
        {
            this.gameObject = gameObject;
        }
        public MakeJsonObject(): Object
        {
            let obj = new Object();
            if (this.gameObject.Type == ObjectType.OBJ_TERRAIN)
            {
                obj =
                {
                    type: this.gameObject.Type,
                    name: this.gameObject.Name,
                    isDummy: (this.gameObject as HeightmapTerrain).IsDummy,
                    vertexIndex: (this.gameObject as unknown as HeightmapTerrain).HeightIndexBuffer,
                    vertexHeight: (this.gameObject as unknown as HeightmapTerrain).HeightBuffer,
                    scale:
                    {
                        x: this.gameObject.PhysicsComponent.GetScale().x,
                        y: this.gameObject.PhysicsComponent.GetScale().y,
                        z: this.gameObject.PhysicsComponent.GetScale().z,
                    },
                    rotation:
                    {
                        x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                    },
                    position:
                    {
                        x: this.gameObject.PhysicsComponent.GetPosition().x,
                        y: this.gameObject.PhysicsComponent.GetPosition().y,
                        z: this.gameObject.PhysicsComponent.GetPosition().z
                    }
                }
            }
            else
            {
                obj = {
                    type: this.gameObject.Type,
                    name: this.gameObject.Name,
                    scale:
                    {
                        x: this.gameObject.PhysicsComponent.GetScale().x,
                        y: this.gameObject.PhysicsComponent.GetScale().y,
                        z: this.gameObject.PhysicsComponent.GetScale().z
                    },
                    rotation:
                    {
                        x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                    },
                    position:
                    {
                        x: this.gameObject.PhysicsComponent.GetPosition().x,
                        y: this.gameObject.PhysicsComponent.GetPosition().y,
                        z: this.gameObject.PhysicsComponent.GetPosition().z
                    },
                    obbSize:
                    {
                        x: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.x: 1,
                        y: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.y : 1,
                        z: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.z : 1,
                    }
                }
            }
            return obj;
        }

        private gameObject: GameObject;
    }
}