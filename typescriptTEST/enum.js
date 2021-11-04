var JWFramework;
(function (JWFramework) {
    var SceneType;
    (function (SceneType) {
        SceneType[SceneType["SCENE_TEST"] = 0] = "SCENE_TEST";
        SceneType[SceneType["SCENE_START"] = 1] = "SCENE_START";
        SceneType[SceneType["SCENE_STAGE"] = 2] = "SCENE_STAGE";
        SceneType[SceneType["SCENE_END"] = 3] = "SCENE_END";
    })(SceneType = JWFramework.SceneType || (JWFramework.SceneType = {}));
    var ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["OBJ_OBJECT3D"] = 0] = "OBJ_OBJECT3D";
        ObjectType[ObjectType["OBJ_OBJECT2D"] = 1] = "OBJ_OBJECT2D";
        ObjectType[ObjectType["OBJ_CAMERA"] = 2] = "OBJ_CAMERA";
        ObjectType[ObjectType["OBJ_END"] = 3] = "OBJ_END";
    })(ObjectType = JWFramework.ObjectType || (JWFramework.ObjectType = {}));
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=enum.js.map