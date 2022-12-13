declare namespace JWFramework {
    class GUIComponent {
        constructor(gameObject: GameObject);
        UpdateDisplay(): void;
        ShowGUI(show: boolean): void;
        private gameObject;
    }
}
