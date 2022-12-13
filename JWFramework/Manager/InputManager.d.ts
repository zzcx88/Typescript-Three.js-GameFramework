declare namespace JWFramework {
    class InputManager {
        private static instance;
        static getInstance(): InputManager;
        constructor();
        private AddKey;
        private KeyPressedCheck;
        UpdateKey(): void;
        GetKeyState(keyName: string, keyState: KeyState): boolean;
        private keys;
    }
}
