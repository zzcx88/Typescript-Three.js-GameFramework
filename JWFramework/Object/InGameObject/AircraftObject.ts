namespace JWFramework
{
    export class AircraftObject extends GameObject
    {
        constructor()
        {
            super();
        }

        public InitializeAfterLoad()
        {
        }

        public CreateCollider()
        {
        }

        public CollisionActive()
        {
        }

        public CollisionDeActive()
        {
        }

        public Animate()
        {
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

        protected throttle: number = 0;
        protected afterBurner: boolean = false;
        protected acceleration: number = 0;
    }
}