import * as THREE from 'three';
import type { GameObject } from '../Object/GameObject';
import { HeightmapTerrain } from '../Object/CommonObject/Terrain/HeightmapTerrain';
import { Missile } from '../Object/InGameObject/Weapons/Missile';
import { ObjectManager } from './ObjectManager';
import type { ObjectSet } from '../define';
import { ObjectType } from '../enum';
import { SceneManager } from './SceneManager';


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

    public CollideRayToTerrain(source: HeightmapTerrain[])
    {
        source.forEach(function (src)
        {
            const destination = src.inSectorObject;
            destination.forEach(function (dst)
            {
                if (dst.CollisionComponent != null && dst.CollisionComponent.Raycaster != null)
                    if ((dst.IsClone == true && dst.IsRayOn == true) || SceneManager.getInstance().CurrentScene.NeedOnTerrain == true)
                    {
                        const intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObjectInstance);
                        if (intersect[0] != undefined)
                        {
                            if (intersect[0].distance < 1)
                            {
                                dst.PhysicsComponent.SetPosition(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                if (dst instanceof Missile)
                                    (dst as Missile).CollisionActive(ObjectType.OBJ_TERRAIN);
                            }
                        }
                        else
                        {
                            dst.CollisionComponent.Raycaster.set(
                                new THREE.Vector3(
                                    dst.PhysicsComponent.GetPosition().x,
                                    2000,
                                    dst.PhysicsComponent.GetPosition().z),
                                new THREE.Vector3(0, -1, 0)
                            );
                            const intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObjectInstance);
                            if (intersect[0] != undefined)
                            {
                                dst.PhysicsComponent.SetPosition(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                            }
                            dst.CollisionComponent.Raycaster.set(dst.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0))
                        }
                    }
            })
        })
    }

    public CollideRayToWater(source: ObjectSet[])
    {
        source.forEach(function (src)
        {
            const destination = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT3D].filter(o_ => o_.GameObject.IsClone).map(o_ => o_.GameObject);
            destination.forEach(function (dst)
            {
                if (dst.CollisionComponent != null && dst.CollisionComponent.Raycaster != null)
                    if ((src.GameObject != undefined && dst.IsRayOn == true) || SceneManager.getInstance().CurrentScene.NeedOnTerrain == true)
                    {
                        const intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                        if (intersect[0] != undefined)
                        {
                            if (intersect[0].distance < 1)
                            {
                                dst.PhysicsComponent.SetPosition(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                if (dst instanceof Missile)
                                    (dst as Missile).CollisionActive(ObjectType.OBJ_TERRAIN);
                            }
                        }
                        else
                        {
                            dst.CollisionComponent.Raycaster.set(
                                new THREE.Vector3(
                                    dst.PhysicsComponent.GetPosition().x,
                                    2000,
                                    dst.PhysicsComponent.GetPosition().z),
                                new THREE.Vector3(0, -1, 0)
                            );
                            const intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                            if (intersect[0] != undefined)
                            {
                                dst.PhysicsComponent.SetPosition(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                            }
                            dst.CollisionComponent.Raycaster.set(dst.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0))
                        }
                    }
            })
        })
    }

    public CollideBoxToBox(source: ObjectSet[], destination: ObjectSet[])
    {
        source.forEach(function (src)
        {
            destination.forEach(function (dst)
            {
                if (src.GameObject.IsClone && dst.GameObject.IsClone)
                {
                    if ((src.GameObject != dst.GameObject) && src.GameObject.CollisionComponent.BoxHelper.box && dst.GameObject.CollisionComponent.BoxHelper.box)
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

    public CollideObbToObb(source: GameObject[], destination: GameObject[])
    {
        source.forEach(function (src)
        {
            destination.forEach(function (dst)
            {
                if (src.IsClone && dst.IsClone)
                {
                    if (src != dst)
                    {
                        if (src.CollisionComponent != null && dst.CollisionComponent != null)
                            if (src.CollisionComponent.OBB && dst.CollisionComponent.OBB)
                                if (src.CollisionComponent.OBB.intersectsOBB(dst.CollisionComponent.OBB, Number.EPSILON))
                                {
                                    if (!(dst instanceof HeightmapTerrain) || !(src instanceof HeightmapTerrain))
                                        src.CollisionActive(dst.Type);
                                    dst.CollisionActive();
                                }
                                else
                                {
                                    if (!(dst instanceof HeightmapTerrain) || !(src instanceof HeightmapTerrain))
                                        src.CollisionDeActive(dst.Type);
                                    dst.CollisionDeActive();
                                }
                    }
                }
            })
        })
    }

    public CollideObbToBox(source: ObjectSet[], destination: ObjectSet[])
    {
        source.forEach(function (src)
        {
            destination.forEach(function (dst)
            {
                if (src.GameObject.IsClone && dst.GameObject.IsClone) {
                    if (src.GameObject != dst.GameObject)
                    {
                        if (src.GameObject.CollisionComponent.OBB && dst.GameObject.CollisionComponent.BoundingBox)
                        if (src.GameObject.CollisionComponent.OBB.intersectsBox3(dst.GameObject.CollisionComponent.BoundingBox))
                        {
                            if (!(dst.GameObject instanceof HeightmapTerrain))
                            {
                                src.GameObject.CollisionActive();
                            }
                            dst.GameObject.CollisionActive(src.GameObject);
                        }
                        else
                        {
                            if (!(dst.GameObject instanceof HeightmapTerrain))
                            {
                                src.GameObject.CollisionDeActive();
                            }
                            dst.GameObject.CollisionDeActive(src.GameObject);
                        }
                    }
                }
            })
        })
    }

    public CollideSphereToBox(source: ObjectSet[], destination: ObjectSet[])
    {
        source.forEach(function (src)
        {
            destination.forEach(function (dst)
            {
                if (src.GameObject.IsClone && dst.GameObject.IsClone)
                {
                    if (src.GameObject != dst.GameObject)
                    {
                        if (src.GameObject.CollisionComponent.BoundingSphere && dst.GameObject.CollisionComponent.BoundingBox)
                            if (src.GameObject.CollisionComponent.BoundingSphere.intersectsBox(dst.GameObject.CollisionComponent.BoundingBox))
                            {
                                if (!(dst.GameObject instanceof HeightmapTerrain))
                                {
                                    src.GameObject.CollisionActive();
                                }
                                dst.GameObject.CollisionActive(src.GameObject);
                            }
                            else
                            {
                                if (!(dst.GameObject instanceof HeightmapTerrain))
                                {
                                    src.GameObject.CollisionDeActive();
                                }
                                dst.GameObject.CollisionDeActive(src.GameObject);
                            }
                    }
                }
            })
        })
    }

    public CollideSphereToSphere(source: GameObject[], destination: GameObject[])
    {
        source.forEach(function (src)
        {
            destination.forEach(function (dst)
            {
                if (src.IsClone && dst.IsClone)
                {
                    if (src != dst)
                    {
                        if (src.CollisionComponent != null && dst.CollisionComponent != null)
                            if (src.CollisionComponent.BoundingSphere && dst.CollisionComponent.BoundingSphere)
                                if (src.CollisionComponent.BoundingSphere.intersectsSphere(dst.CollisionComponent.BoundingSphere))
                                {
                                    if (!(dst instanceof HeightmapTerrain) || !(src instanceof HeightmapTerrain))
                                        src.CollisionActive(dst.Type);
                                    dst.CollisionActive();
                                }
                                else
                                {
                                    if (!(dst instanceof HeightmapTerrain) || !(src instanceof HeightmapTerrain))
                                        src.CollisionDeActive(dst.Type);
                                    dst.CollisionDeActive();
                                }
                    }
                }
            })
        })
    }
}
