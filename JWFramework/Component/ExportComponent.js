var JWFramework;
(function (JWFramework) {
    class ExportComponent {
        constructor(gameObject) {
            this.gameObjet = gameObject;
        }
        MakeJsonObject() {
            let obj = new Object();
            if (this.gameObjet.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                obj = {
                    type: this.gameObjet.Type,
                    name: this.gameObjet.Name,
                    vertexIndex: this.gameObjet.HeightIndexBuffer,
                    vertexHeight: this.gameObjet.HeightBuffer,
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
                };
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
                };
            }
            return obj;
        }
    }
    JWFramework.ExportComponent = ExportComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ExportComponent.js.map