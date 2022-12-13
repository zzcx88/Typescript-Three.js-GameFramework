var JWFramework;
(function (JWFramework) {
    class AircraftObject extends JWFramework.GameObject {
        constructor() {
            super();
            this.throttle = 0;
            this.afterBurner = false;
            this.acceleration = 0;
        }
        InitializeAfterLoad() {
        }
        CreateCollider() {
        }
        CollisionActive() {
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.throttle > 100) {
                this.throttle = 100;
                this.afterBurner = true;
            }
            else if (this.throttle < 100) {
                this.afterBurner = false;
            }
            else if (this.throttle < 0) {
                this.throttle = 0;
                this.afterBurner = false;
            }
        }
    }
    JWFramework.AircraftObject = AircraftObject;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=AircraftObject.js.map