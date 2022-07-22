namespace JWFramework
{
    export class Light extends GameObject
    {
        constructor()
        {
            super();
            this.color = 0x000000;
            this.intensity = 0;
            this.light = new THREE.DirectionalLight(this.color, this.intensity);
            this.GameObjectInstance = this.light;
        }

        public get Color(): number
        {
            return this.color;
        }

        public SetColor(color: number)
        {
            this.color = color;

            this.SetLightElement();
        }

        public get Intensity(): number
        {
            return this.intensity;
        }
        public set Intensity(intensity: number)
        {
            this.intensity = intensity;

            this.SetLightElement();
        }

        private SetLightElement()
        {
            this.light.color.set(this.color);
            this.light.intensity = this.intensity;
            this.light.target.position.set(0, 0, 0);
        }

        private color: number;
        private intensity: number;
        private light: THREE.DirectionalLight;
    }
}