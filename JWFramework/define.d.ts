/// <reference path="Object/EditObject/EditObject.d.ts" />
declare namespace JWFramework {
    class Define {
        static readonly SCREEN_WIDTH: number;
        static readonly SCREEN_HEIGHT: number;
    }
    class ModelSceneEdit {
        private static instance;
        ModelSceneEdit: any;
        static getInstance(): ModelSceneEdit;
        constructor();
        get ModelScene(): ModelSet[];
        get ModelNumber(): number;
        private helmet;
        private F16;
        private flower;
        private sceneTestModel;
        private modelNumber;
    }
    class ModelSceneStage {
        private static instance;
        ModelSceneEdit: any;
        static getInstance(): ModelSceneStage;
        constructor();
        get ModelScene(): ModelSet[];
        get ModelNumber(): number;
        private F16;
        private sceneTestModel;
        private modelNumber;
    }
    interface ModelSet {
        model: GameObject;
        url: string;
    }
    interface ObjectSet {
        GameObject: GameObject;
        Name: string;
    }
    interface KeySet {
        KeyCode: number;
        KeyName: string;
        KeyEvent: boolean;
        KeyDown: boolean;
        KeyPressed: boolean;
        KeyUp: boolean;
    }
}
