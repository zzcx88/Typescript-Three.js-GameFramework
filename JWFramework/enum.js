var JWFramework;
(function (JWFramework) {
    let SceneType;
    (function (SceneType) {
        SceneType[SceneType["SCENE_TEST"] = 0] = "SCENE_TEST";
        SceneType[SceneType["SCENE_START"] = 1] = "SCENE_START";
        SceneType[SceneType["SCENE_STAGE"] = 2] = "SCENE_STAGE";
        SceneType[SceneType["SCENE_END"] = 3] = "SCENE_END";
    })(SceneType = JWFramework.SceneType || (JWFramework.SceneType = {}));
    let ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["OBJ_TERRAIN"] = 0] = "OBJ_TERRAIN";
        ObjectType[ObjectType["OBJ_OBJECT3D"] = 1] = "OBJ_OBJECT3D";
        ObjectType[ObjectType["OBJ_OBJECT2D"] = 2] = "OBJ_OBJECT2D";
        ObjectType[ObjectType["OBJ_CAMERA"] = 3] = "OBJ_CAMERA";
        ObjectType[ObjectType["OBJ_END"] = 4] = "OBJ_END";
    })(ObjectType = JWFramework.ObjectType || (JWFramework.ObjectType = {}));
    let PickMode;
    (function (PickMode) {
        PickMode[PickMode["PICK_MODIFY"] = 0] = "PICK_MODIFY";
        PickMode[PickMode["PICK_CLONE"] = 1] = "PICK_CLONE";
        PickMode[PickMode["PICK_TERRAIN"] = 2] = "PICK_TERRAIN";
        PickMode[PickMode["PICK_REMOVE"] = 3] = "PICK_REMOVE";
    })(PickMode = JWFramework.PickMode || (JWFramework.PickMode = {}));
    let CameraMode;
    (function (CameraMode) {
        CameraMode[CameraMode["CAMERA_ORBIT"] = 0] = "CAMERA_ORBIT";
        CameraMode[CameraMode["CAMERA_3RD"] = 1] = "CAMERA_3RD";
    })(CameraMode = JWFramework.CameraMode || (JWFramework.CameraMode = {}));
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=enum.js.map