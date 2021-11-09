namespace JWFramework {
    export class SceneBase {

        constructor() { }

        public Animate() { }

        public get Picker(): Picker {

            return this.picker;
        }

        public SetPicker() {
            this.picker = new Picker();
        }

        private picker: Picker;
    }
}
