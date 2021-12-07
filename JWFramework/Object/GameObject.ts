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

        public get IsClone(): boolean {
            return this.isClone;
        }

        public set IsClone(isClone: boolean) {
            this.isClone = isClone;
        }

        public get PhysicsComponent(): PhysicsComponent {
            return this.physicsComponent;
        }

        public get GraphicComponent(): GraphComponent {
            return this.graphicComponent;
        }

        public get GUIComponent(): GUIComponent {
            return this.guiComponent;
        }

        public get ExportComponent(): ExportComponent {
            return this.exportComponent;
        }

        public get CollisionComponent(): CollisionComponent {
            return this.collisionComponent;
        }

        public get PhysicsCompIncluded() {
            return this.physicsCompIncluded;
        }

        public get GraphicCompIncluded() {
            return this.graphicCompIncluded;
        }

        public set PhysicsCompIncluded(isIncluded: boolean) {
            this.physicsCompIncluded = isIncluded;
        }

        public set GraphicCompIncluded(isIncluded: boolean) {
            this.graphicCompIncluded = isIncluded;
        }

        public set Picked(picked: boolean) {
            this.picked = picked;
        }

        public get Picked(): boolean {
            return this.picked;
        }

        public get GameObjectInstance() {
            return this.gameObjectInstance;
        }

        public set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance ;
        }

        public get IsDead(): boolean {
            return this.isDead;
        }

        public set IsDead(flag: boolean) {
            this.isDead = flag;
        }

        public CollisionActive(value: any = 0) { }
        public CollisionDeActive(value: any = 0) { }

        public Animate() {}

        public DeleteObject() {
            this.isDead = true;
        }

        protected gameObjectInstance;
        protected type: ObjectType;
        protected name: string;
        protected isClone: boolean = false;
        protected isDead: boolean = false;

        protected physicsComponent: PhysicsComponent;
        protected graphicComponent: GraphComponent;
        protected guiComponent: GUIComponent;
        protected exportComponent: ExportComponent;
        protected collisionComponent: CollisionComponent;

        private physicsCompIncluded: boolean = false;
        private graphicCompIncluded: boolean = false;

        private picked: boolean = false;
    }
}
