namespace JWFramework
{
    export class Light extends GameObject
    {
        constructor(type: LightType)
        {
            super();
            this.color = 0x000000;
            this.intensity = 0;
            if (type == LightType.LIGHT_DIRECTIONAL)
                this.light = new THREE.DirectionalLight(this.color, this.intensity);
            else if (type == LightType.LIGHT_AMBIENT)
                this.light = new THREE.AmbientLight(this.color, this.intensity);
            this.GameObjectInstance = this.light;
        }

        public get Color(): number
        {
            return this.color;
        }

        public SetColor(color)
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
            if (this.light instanceof THREE.DirectionalLight) {
                this.light.target.position.set(0, 0, 0);
            }
        }

        private color;
        private intensity: number;
        private light: THREE.Light;
    }
}