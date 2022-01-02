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
                key.KeyEvent = true;
                //for (let i: number = 0; i < this.keys.length; ++i) {
                //    if (this.keys[i].KeyCode == e.keyCode) {
                //        this.keys[i].KeyEvent = true;
                //        return;
                //    }
                //}
                //this.KeyPressedCheck(e.keyCode);
            });
            window.addEventListener('keyup', (e) => {
                let key = this.keys.find(data => { return data.KeyCode == e.keyCode; });
                key.KeyEvent = false;
                //for (let i: number = 0; i < this.keys.length; ++i) {
                //    if (this.keys[i].KeyCode == e.keyCode) {
                //        this.keys[i].KeyEvent = false;
                //        return;
                //    }
                //}
                //this.KeyPressedCheck(e.keyCode);
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
        //만약 해당 키코드가 눌렸다면 pressed를 true로 바꾼 후 리턴
        KeyPressedCheck(key) {
            if (key.KeyEvent == true) {
                //이전에 눌린적이 없을때 누른경우
                if (key.KeyDown == false && key.KeyPressed == false) {
                    key.KeyDown = true;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                //이전에 눌린적이 있는 상태에서 누른경우
                else {
                    key.KeyDown = false;
                    key.KeyPressed = true;
                    key.KeyUp = false;
                }
            }
            else {
                //이전에 누른적이 없는 상태에서 뗀 경우
                if (key.KeyUp == true) {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                //이전에 누른적이 있는 상태에서 뗀 경우
                else {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = true;
                }
            }
            //return this.keys[i];
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