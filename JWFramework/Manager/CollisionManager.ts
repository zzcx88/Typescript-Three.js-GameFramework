namespace JWFramework
{
    export class CollisionManager
    {

        private static instance: CollisionManager;

        static getInstance()
        {
            if (!CollisionManager.instance)
            {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }

        public CollideRayToTerrain(sorce: ObjectSet[], destination: ObjectSet[])
        {
            sorce.forEach(function (src)
            {
                destination.forEach(function (dst)
                {
                    if (dst.GameObject != undefined && src.GameObject.IsClone == true) {
                        let intersect = src.GameObject.CollisionComponent.Raycaster.intersectObject(dst.GameObject.GameObjectInstance);
                        if (intersect[0] != undefined) {
                            if (intersect[0].distance < 1/* || src.GameObject.PhysicsComponent.GetPosition().y < 0*/) {
                                //let terrain = ObjectManager.getInstance().GetObjectFromName(intersect[0].object.name);
                                src.GameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                //alert("collide");
                            }
                        }
                        else {
                            src.GameObject.CollisionComponent.Raycaster.set(
                                new THREE.Vector3(
                                    src.GameObject.PhysicsComponent.GetPosition().x,
                                    2000,
                                    src.GameObject.PhysicsComponent.GetPosition().z),
                                new THREE.Vector3(0, -1, 0)
                            );
                            let intersect = src.GameObject.CollisionComponent.Raycaster.intersectObject(dst.GameObject.GameObjectInstance);
                            if (intersect[0] != undefined) {
                                src.GameObject.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                            }
                            src.GameObject.CollisionComponent.Raycaster.set(src.GameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0))
                        }
                    }
                })
            })
        }

        public CollideBoxToBox(sorce: ObjectSet[], destination: ObjectSet[])
        {
            sorce.forEach(function (src)
            {
                destination.forEach(function (dst)
                {
                    if (src.GameObject.IsClone && dst.GameObject.IsClone)
                    {
                        if (src.GameObject != dst.GameObject)
                        {
                            if (src.GameObject.CollisionComponent.BoxHelper.box.intersectsBox(dst.GameObject.CollisionComponent.BoxHelper.box)) {
                                src.GameObject.CollisionActive(dst.GameObject);
                                dst.GameObject.CollisionActive();
                            }
                            else
                            {
                                src.GameObject.CollisionDeActive(dst.GameObject);
                                dst.GameObject.CollisionDeActive();
                            }
                        }
                    }
                })
            })
        }

        public CollideObbToObb(sorce: ObjectSet[], destination: ObjectSet[])
        {
            sorce.forEach(function (src)
            {
                destination.forEach(function (dst)
                {
                    if (src.GameObject.IsClone && dst.GameObject.IsClone)
                    {
                        if (src.GameObject != dst.GameObject)
                        {
                            if (src.GameObject.CollisionComponent.OBB.intersectsOBB(dst.GameObject.CollisionComponent.OBB, Number.EPSILON))
                            {
                                src.GameObject.CollisionActive(dst.GameObject.Type);
                                dst.GameObject.CollisionActive();
                            }
                            else
                            {
                                src.GameObject.CollisionDeActive(dst.GameObject.Type);
                                dst.GameObject.CollisionDeActive();
                            }
                        }
                    }
                })
            })
        }

        public CollideObbToBox(sorce: ObjectSet[], destination: ObjectSet[])
        {
            sorce.forEach(function (src)
            {
                destination.forEach(function (dst)
                {
                    if (src.GameObject.IsClone && dst.GameObject.IsClone) {
                        if (src.GameObject != dst.GameObject) {
                            if (src.GameObject.CollisionComponent.OBB.intersectsBox3(dst.GameObject.CollisionComponent.BoundingBox)) {
                                src.GameObject.CollisionActive();
                                dst.GameObject.CollisionActive(src.GameObject);
                            }
                            else {
                                src.GameObject.CollisionDeActive();
                                dst.GameObject.CollisionDeActive(src.GameObject);
                            }
                        }
                    }
                })
            })
        }

        public CollideBoxToSphere(sorce: ObjectSet[], destination: ObjectSet[])
        {

        }

        public CollideSphereToSphere(sorce: ObjectSet[], destination: ObjectSet[])
        {

        }
    }
}