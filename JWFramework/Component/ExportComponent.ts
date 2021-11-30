namespace JWFramework {
    export class ExportComponent {
        constructor(gameObject: GameObject) {
            this.gameObjet = gameObject;
        }
        public MakeJsonObject(): Object {
            let obj = new Object();
            if (this.gameObjet.Type == ObjectType.OBJ_TERRAIN) {
                obj = {
                    type: this.gameObjet.Type,
                    name: this.gameObjet.Name,
                    vertexIndex: (this.gameObjet as unknown as HeightmapTerrain).HeightIndexBuffer,
                    vertexHeight: (this.gameObjet as unknown as HeightmapTerrain).HeightBuffer,
                    scale: {
                        x: this.gameObjet.PhysicsComponent.GetScale().x,
                        y: this.gameObjet.PhysicsComponent.GetScale().y,
                        z: this.gameObjet.PhysicsComponent.GetScale().z,
                    },
                    rotation: {
                        x: this.gameObjet.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObjet.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObjet.PhysicsComponent.GetRotateEuler().z
                    },
                    position: {
                        x: this.gameObjet.PhysicsComponent.GetPosition().x,
                        y: this.gameObjet.PhysicsComponent.GetPosition().y,
                        z: this.gameObjet.PhysicsComponent.GetPosition().z
                    }
                }
            }
            else {
                obj = {
                    type: this.gameObjet.Type,
                    name: this.gameObjet.Name,
                    scale: {
                        x: this.gameObjet.PhysicsComponent.GetScale().x,
                        y: this.gameObjet.PhysicsComponent.GetScale().y,
                        z: this.gameObjet.PhysicsComponent.GetScale().z,
                    },
                    rotation: {
                        x: this.gameObjet.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObjet.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObjet.PhysicsComponent.GetRotateEuler().z
                    },
                    position: {
                        x: this.gameObjet.PhysicsComponent.GetPosition().x,
                        y: this.gameObjet.PhysicsComponent.GetPosition().y,
                        z: this.gameObjet.PhysicsComponent.GetPosition().z
                    }
                }
            }
            return obj;
        }

        private gameObjet: GameObject;
    }
}