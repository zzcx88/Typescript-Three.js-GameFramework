declare namespace JWFramework {
    class GUI_SRT extends GUI_Base {
        constructor(gameObject: GameObject);
        protected CreateFolder(): void;
        protected AddElement(): void;
        SetGameObject(gameObject: GameObject): void;
        UpdateDisplay(): void;
        ShowGUI(show: boolean): void;
        private datGui;
        private gameObject;
        private positionFolder;
        private rotateFolder;
        private scaleFolder;
        private isPlayerFolder;
        private isPlayerFunc;
    }
}
