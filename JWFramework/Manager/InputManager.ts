namespace JWFramework {
    export class InputManager {

        private static instance: InputManager;

        static getInstance() {
            if (!InputManager.instance) {
                InputManager.instance = new InputManager;
            }
            return InputManager.instance;
        }

        public constructor() {
            window.addEventListener('keydown', (e) => {
                this.KeyPressedCheck(e.keyCode, true);
            });
            window.addEventListener('keyup', (e) => {
                this.KeyPressedCheck(e.keyCode, false);
            });

            this.AddKey(37, 'left');
            this.AddKey(39, 'right');
            this.AddKey(38, 'up');
            this.AddKey(40, 'down');
            this.AddKey(87, 'w');
            this.AddKey(70, 'f');

        }

        private AddKey = (Code: number, name: string) => {
            this.keys.push({ KeyCode: Code, KeyName: name, KeyPressed: false });
        }

        //만약 해당 키코드가 눌렸다면 pressed를 true로 바꾼 후 리턴
        private KeyPressedCheck(keyCode: number, pressed: boolean) {
            for (let i: number = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyCode == keyCode) {
                    this.keys[i].KeyPressed = pressed;
                    return this.keys[i].KeyPressed;
                }
            }
        }

        public GetKeyState(keyName: string): boolean {
            for (let i: number = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyName == keyName)
                    return this.keys[i].KeyPressed;
            }
        }

        private keys: KeySet[] = [];
    }
    interface KeySet {
        KeyCode: number;
        KeyName: string;
        KeyPressed: boolean;
    }
}