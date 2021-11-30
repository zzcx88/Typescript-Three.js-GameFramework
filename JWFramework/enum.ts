namespace JWFramework {
    export enum SceneType {
        SCENE_TEST,
        SCENE_START,
        SCENE_STAGE,
        SCENE_END
    }

    export enum ObjectType {
        OBJ_TERRAIN,
        OBJ_OBJECT3D,
        OBJ_OBJECT2D,
        OBJ_CAMERA,
        OBJ_END
    }

    export enum PickMode {
        PICK_MODIFY,
        PICK_CLONE,
        PICK_TERRAIN,
        PICK_REMOVE
    }

    export enum CameraMode {
        CAMERA_ORBIT,
        CAMERA_3RD
    }
}