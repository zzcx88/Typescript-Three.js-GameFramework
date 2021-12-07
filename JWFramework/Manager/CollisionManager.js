var JWFramework;
(function (JWFramework) {
    class CollisionManager {
        static getInstance() {
            if (!CollisionManager.instance) {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }
        CollideRayToTerrain(sorce, destination) {
            sorce.forEach(function (src) {
                destination.forEach(function (dst) {
                    if (dst.GameObject != undefined && src.GameObject.IsClone == true) {
                        let intersect = src.GameObject.CollisionComponent.Raycaster.intersectObject(dst.GameObject.GameObjectInstance);
                        if (intersect[0] != undefined)
                            if (intersect[0].distance < 1 || src.GameObject.PhysicsComponent.GetPosition().y < 0)
                                src.GameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1.0000001, intersect[0].point.z);
                    }
                });
            });
        }
        CollideBoxToBox(sorce, destination) {
            sorce.forEach(function (src) {
                destination.forEach(function (dst) {
                    if (src.GameObject.CollisionComponent.BoxHelper.box.intersectsBox(dst.GameObject.CollisionComponent.BoxHelper.box)) {
                        src.GameObject.CollisionActive(dst.GameObject.Type);
                        dst.GameObject.CollisionActive();
                    }
                    else {
                        src.GameObject.CollisionDeActive(dst.GameObject.Type);
                        dst.GameObject.CollisionDeActive();
                    }
                });
            });
        }
        CollideBoxToSphere(sorce, destination) {
        }
        CollideSphereToSphere(sorce, destination) {
        }
    }
    JWFramework.CollisionManager = CollisionManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=CollisionManager.js.map