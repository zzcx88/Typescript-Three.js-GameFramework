namespace JWFramework
{
    export class ObjectPool<T extends GameObject> {
        private objects: T[] = [];
        private objectClass: new () => T;

        constructor(objectClass: new () => T)
        {
            this.objectClass = objectClass;
        }

        public AddObject(obj: T)
        {
            this.objects.push(obj);
        }

        public GetObject(): T
        {
            let obj: T;

            if (this.objects.length > 0)
            {
                obj = this.objects.pop()!;
            } else
            {
                obj = new this.objectClass();
            }

            return obj;
        }

        public ReleaseObject(obj: T)
        {
            obj.Reset();
            this.objects.push(obj);
        }
    }
}