namespace JWFramework {
    export class GameObject {

        public InitializeAfterLoad() { }

        public get Type(): ObjectType {
            return this.type;
        }

        public get Name(): string {
            return this.name;
        }

        public set Name(name: string) {
            this.name = name;
        }

        public get PhysicsComponent(): PhysicsComponent {
            return this.physicsComponent;
        }

        public get GraphicComponent(): GraphComponent {
            return this.graphicComponent;
        }

        public get PhysicsCompIncluded() {
            return this.physicsCompIncluded;
        }

        public get GraphicCompIncluded() {
            return this.graphicCompIncluded;
        }

        public set Picked(picked: boolean) {
            this.picked = picked;
        }

        public get Picked(): boolean {
            return this.picked;
        }

        public set PhysicsCompIncluded(isIncluded: boolean) {
            this.physicsCompIncluded = isIncluded;
        }

        public set GraphicCompIncluded(isIncluded: boolean) {
            this.graphicCompIncluded = isIncluded;
        }

        public get GameObjectInstance() {
            return this.gameObjectInstance;
        }

        public set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance ;
        }

        public Animate() { }

        private DeleteObject() { }

        protected gameObjectInstance;
        protected type: ObjectType;
        protected name: string;

        protected physicsComponent: PhysicsComponent;
        protected graphicComponent: GraphComponent;
        protected guiComponent: GUIComponent;

        private physicsCompIncluded: boolean = false;
        private graphicCompIncluded: boolean = false;

        private picked: boolean = false;
    }
}
