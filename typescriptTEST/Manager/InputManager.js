var JWFramework;
(function (JWFramework) {
    var InputManager = /** @class */ (function () {
        function InputManager() {
            var _this = this;
            this.AddKey = function (Code, name) {
                _this.keys.push({ KeyCode: Code, KeyName: name, KeyPressed: false });
            };
            this.keys = [];
            window.addEventListener('keydown', function (e) {
                _this.KeyPressedCheck(e.keyCode, true);
            });
            window.addEventListener('keyup', function (e) {
                _this.KeyPressedCheck(e.keyCode, false);
            });
            this.AddKey(37, 'left');
            this.AddKey(39, 'right');
            this.AddKey(38, 'up');
        }
        InputManager.getInstance = function () {
            if (!InputManager.instance) {
                InputManager.instance = new InputManager;
            }
            return InputManager.instance;
        };
        //만약 해당 키코드가 눌렸다면 pressed를 true로 바꾼 후 리턴
        InputManager.prototype.KeyPressedCheck = function (keyCode, pressed) {
            for (var i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyCode == keyCode) {
                    this.keys[i].KeyPressed = pressed;
                    return this.keys[i].KeyPressed;
                }
            }
        };
        InputManager.prototype.GetKeyState = function (keyName) {
            for (var i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyName == keyName)
                    return this.keys[i].KeyPressed;
            }
        };
        return InputManager;
    }());
    JWFramework.InputManager = InputManager;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=InputManager.js.map