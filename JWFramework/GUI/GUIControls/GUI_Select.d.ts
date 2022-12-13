declare namespace JWFramework {
    class GUI_Select extends GUI_Base {
        constructor();
        protected CreateFolder(): void;
        protected AddElement(): void;
        GetSelectObjectName(): string;
        private datGui;
        private objectListFolder;
        private exportButtonFolder;
        private makeJson;
        private List;
    }
}
