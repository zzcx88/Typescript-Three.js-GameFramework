namespace JWFramework {
    export class CollisionManager {

        private static instance: CollisionManager;

        static getInstance() {
            if (!CollisionManager.instance) {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }

        public CollideRayToTerrain(sorce: ObjectSet[], destination: ObjectSet[]) {
            sorce.forEach(function(src){
                destination.forEach(function (dst) {
                    if (dst.GameObject != undefined && src.GameObject.IsClone == true) {
                        let intersect = src.GameObject.CollisionComponent.Raycaster.intersectObject(dst.GameObject.GameObjectInstance);
                        if (intersect[0] != undefined)
                            if (intersect[0].distance < 1/* || src.GameObject.PhysicsComponent.GetPosition().y < 0*/) {
                                let terrain = ObjectManager.getInstance().GetObjectFromName(intersect[0].object.name);
                                //(terrain as unknown as HeightmapTerrain).planeGeomatry.getAttribute('position').getY();
                                src.GameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1.0000001, intersect[0].point.z);
                                //alert("collide");
                            }
                    }
                })
            })
        }

        public CollideBoxToBox(sorce: ObjectSet[], destination: ObjectSet[]) {
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
                })
            })
        }

        public CollideBoxToSphere(sorce: ObjectSet[], destination: ObjectSet[]) {

        }

        public CollideSphereToSphere(sorce: ObjectSet[], destination: ObjectSet[]) {

        }
    }
}