var JWFramework;
(function (JWFramework) {
    class InputManager {
        constructor() {
            this.AddKey = (Code, name) => {
                this.keys.push({ KeyCode: Code, KeyName: name, KeyPressed: false });
            };
            this.keys = [];
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
            this.AddKey(32, 'space');
            this.AddKey(46, 'delete');
            this.AddKey(82, 'r');
            this.AddKey(87, 'w');
            this.AddKey(70, 'f');
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
        KeyPressedCheck(keyCode, pressed) {
            for (let i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyCode == keyCode) {
                    this.keys[i].KeyPressed = pressed;
                    return this.keys[i].KeyPressed;
                }
            }
        }
        GetKeyState(keyName) {
            for (let i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyName == keyName)
                    return this.keys[i].KeyPressed;
            }
        }
    }
    JWFramework.InputManager = InputManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=InputManager.js.map