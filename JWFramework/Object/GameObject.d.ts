declare namespace JWFramework {
    class GameObject {
        InitializeAfterLoad(): void;
        get Type(): ObjectType;
        get Name(): string;
        set Name(name: string);
        get IsClone(): boolean;
        set IsClone(isClone: boolean);
        get IsPlayer(): boolean;
        set IsPlayer(flag: boolean);
        get PhysicsComponent(): PhysicsComponent;
        get GraphicComponent(): GraphComponent;
        get GUIComponent(): GUIComponent;
        get ExportComponent(): ExportComponent;
        get CollisionComponent(): CollisionComponent;
        get PhysicsCompIncluded(): boolean;
        get GraphicCompIncluded(): boolean;
        set PhysicsCompIncluded(isIncluded: boolean);
        set GraphicCompIncluded(isIncluded: boolean);
        set Picked(picked: boolean);
        get Picked(): boolean;
        get GameObjectInstance(): any;
        set GameObjectInstance(gameObjectInstance: any);
        get IsDead(): boolean;
        set IsDead(flag: boolean);
        CollisionActive(value?: any): void;
        CollisionDeActive(value?: any): void;
        Animate(): void;
        DeleteObject(): void;
        protected gameObjectInstance: any;
        protected type: ObjectType;
        protected name: string;
        protected isClone: boolean;
        protected isDead: boolean;
        protected isPlayer: boolean;
        protected physicsComponent: PhysicsComponent;
        protected graphicComponent: GraphComponent;
        protected guiComponent: GUIComponent;
        protected exportComponent: ExportComponent;
        protected collisionComponent: CollisionComponent;
        private physicsCompIncluded;
        private graphicCompIncluded;
        private picked;
    }
}
