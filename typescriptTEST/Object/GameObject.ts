namespace JWFramework {
    export class GameObject {

        public InitializeAfterLoad() { }

        public get Type(): ObjectType {
            return this.type;
        }

        public get Mesh(): any {
            return this.mesh;
        }

        public get GameObjectInstance(): THREE.Group {
            return this.gameObjectInstance;
        }

        public set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance ;
        }

        public Animate() { }

        private DeleteObject() { }

        protected gameObjectInstance;
        protected geometry;
        protected material;
        protected mesh;
        protected type: ObjectType;
    }
}
