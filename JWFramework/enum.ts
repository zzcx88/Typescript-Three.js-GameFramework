namespace JWFramework
{
    export enum SceneType
    {
        SCENE_EDIT,
        SCENE_START,
        SCENE_STAGE,
        SCENE_END
    }

    export enum ObjectType
    {
        OBJ_TERRAIN,
        OBJ_OBJECT3D,
        OBJ_OBJECT2D,
        OBJ_AIRCRAFT,
        OBJ_MISSILE,
        OBJ_CAMERA,
        OBJ_END
    }

    export enum LightType
    {
        LIGHT_DIRECTIONAL,
        LIGHT_AMBIENT
    }

    export enum PickMode
    {
        PICK_MODIFY,
        PICK_CLONE,
        PICK_TERRAIN,
        PICK_DUMMYTERRAIN,
        PICK_REMOVE
    }

    export enum TerrainOption
    {
        TERRAIN_UP,
        TERRAIN_DOWN,
        TERRAIN_BALANCE,
        TERRAIN_LOAD,
        TERRAIN_END
    }

    export enum CameraMode
    {
        CAMERA_ORBIT,
        CAMERA_3RD
    }

    export enum KeyState
    {
        KEY_DOWN,
        KEY_PRESS,
        KEY_UP
    }
}