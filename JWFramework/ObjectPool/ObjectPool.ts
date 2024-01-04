namespace JWFramework
{
    interface Resettable
    {
        reset(): void;
    }

    export class ObjectPool<T extends Resettable> {
        private objects: T[] = [];
        private objectClass: new () => T;

        constructor(objectClass: new () => T)
        {
            this.objectClass = objectClass;
        }

        public getObject(): T
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

        public releaseObject(obj: T)
        {
            obj.reset();
            this.objects.push(obj);
        }
    }
}