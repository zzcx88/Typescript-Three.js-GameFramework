/// <reference path="../Picker/Picker.ts" />
namespace JWFramework
{
    export class SceneBase
    {

        constructor(sceneManager: SceneManager)
        {
            this.sceneManager = sceneManager;
            this.BuildObject();
            this.BuildLight();
            this.BuildFog();
            this.SetPicker();
        }

        protected BuildObject() { }

        protected BuildLight() { }

        protected BuildFog() { }

        public Animate() { }


        public get SceneManager()
        {
            return this.sceneManager;
        }

        public get Picker(): Picker
        {
            return this.picker;
        }
        public SetPicker()
        {
            this.picker = new Picker();
        }

        private sceneManager: SceneManager
        private picker: Picker;
    }
}
