declare namespace JWFramework {
    enum SceneType {
        SCENE_EDIT = 0,
        SCENE_START = 1,
        SCENE_STAGE = 2,
        SCENE_END = 3
    }
    enum ObjectType {
        OBJ_TERRAIN = 0,
        OBJ_OBJECT3D = 1,
        OBJ_OBJECT2D = 2,
        OBJ_AIRCRAFT = 3,
        OBJ_CAMERA = 4,
        OBJ_END = 5
    }
    enum PickMode {
        PICK_MODIFY = 0,
        PICK_CLONE = 1,
        PICK_TERRAIN = 2,
        PICK_REMOVE = 3
    }
    enum TerrainOption {
        TERRAIN_UP = 0,
        TERRAIN_DOWN = 1,
        TERRAIN_BALANCE = 2,
        TERRAIN_LOAD = 3,
        TERRAIN_END = 4
    }
    enum CameraMode {
        CAMERA_ORBIT = 0,
        CAMERA_3RD = 1
    }
    enum KeyState {
        KEY_DOWN = 0,
        KEY_PRESS = 1,
        KEY_UP = 2
    }
}
