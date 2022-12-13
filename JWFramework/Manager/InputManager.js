var JWFramework;
(function (JWFramework) {
    class InputManager {
        constructor() {
            this.AddKey = (Code, name) => {
                this.keys.push({ KeyCode: Code, KeyName: name, KeyEvent: false, KeyPressed: false, KeyDown: false, KeyUp: false });
            };
            this.keys = [];
            window.addEventListener('keydown', (e) => {
                let key = this.keys.find(data => { return data.KeyCode == e.keyCode; });
                if (key != undefined) {
                    key.KeyEvent = true;
                }
            });
            window.addEventListener('keyup', (e) => {
                let key = this.keys.find(data => { return data.KeyCode == e.keyCode; });
                if (key != undefined) {
                    key.KeyEvent = false;
                }
            });
            this.AddKey(37, 'left');
            this.AddKey(39, 'right');
            this.AddKey(38, 'up');
            this.AddKey(40, 'down');
            this.AddKey(32, 'space');
            this.AddKey(46, 'delete');
            this.AddKey(82, 'r');
            this.AddKey(87, 'w');
            this.AddKey(70, 'f');
            this.AddKey(84, 't');
            this.AddKey(49, '1');
            this.AddKey(50, '2');
            this.AddKey(51, '3');
            this.AddKey(52, '4');
            this.AddKey(53, '5');
        }
        static getInstance() {
            if (!InputManager.instance) {
                InputManager.instance = new InputManager;
            }
            return InputManager.instance;
        }
        KeyPressedCheck(key) {
            if (key.KeyEvent == true) {
                if (key.KeyDown == false && key.KeyPressed == false) {
                    key.KeyDown = true;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                else {
                    key.KeyDown = false;
                    key.KeyPressed = true;
                    key.KeyUp = false;
                }
            }
            else {
                if (key.KeyUp == true) {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                else {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = true;
                }
            }
        }
        UpdateKey() {
            for (let i = 0; i < this.keys.length; ++i) {
                this.KeyPressedCheck(this.keys[i]);
            }
        }
        GetKeyState(keyName, keyState) {
            let key;
            for (let i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyName == keyName) {
                    if (keyState == JWFramework.KeyState.KEY_DOWN)
                        key = this.keys[i].KeyDown;
                    if (keyState == JWFramework.KeyState.KEY_PRESS)
                        key = this.keys[i].KeyPressed;
                    if (keyState == JWFramework.KeyState.KEY_UP)
                        key = this.keys[i].KeyUp;
                    return key;
                }
            }
        }
    }
    JWFramework.InputManager = InputManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=InputManager.js.map