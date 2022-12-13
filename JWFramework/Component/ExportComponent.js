var JWFramework;
(function (JWFramework) {
    class ExportComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
        }
        MakeJsonObject() {
            let obj = new Object();
            if (this.gameObject.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                obj =
                    {
                        type: this.gameObject.Type,
                        name: this.gameObject.Name,
                        vertexIndex: this.gameObject.HeightIndexBuffer,
                        vertexHeight: this.gameObject.HeightBuffer,
                        scale: {
                            x: this.gameObject.PhysicsComponent.GetScale().x,
                            y: this.gameObject.PhysicsComponent.GetScale().y,
                            z: this.gameObject.PhysicsComponent.GetScale().z,
                        },
                        rotation: {
                            x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                            y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                            z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                        },
                        position: {
                            x: this.gameObject.PhysicsComponent.GetPosition().x,
                            y: this.gameObject.PhysicsComponent.GetPosition().y,
                            z: this.gameObject.PhysicsComponent.GetPosition().z
                        }
                    };
            }
            else {
                obj = {
                    type: this.gameObject.Type,
                    name: this.gameObject.Name,
                    scale: {
                        x: this.gameObject.PhysicsComponent.GetScale().x,
                        y: this.gameObject.PhysicsComponent.GetScale().y,
                        z: this.gameObject.PhysicsComponent.GetScale().z,
                    },
                    rotation: {
                        x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                    },
                    position: {
                        x: this.gameObject.PhysicsComponent.GetPosition().x,
                        y: this.gameObject.PhysicsComponent.GetPosition().y,
                        z: this.gameObject.PhysicsComponent.GetPosition().z
                    }
                };
            }
            return obj;
        }
    }
    JWFramework.ExportComponent = ExportComponent;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=ExportComponent.js.map