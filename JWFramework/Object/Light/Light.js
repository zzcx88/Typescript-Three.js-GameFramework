var JWFramework;
(function (JWFramework) {
    class Light extends JWFramework.GameObject {
        constructor() {
            super();
            this.color = 0x000000;
            this.intensity = 0;
            this.light = new THREE.DirectionalLight(this.color, this.intensity);
            this.GameObjectInstance = this.light;
        }
        get Color() {
            return this.color;
        }
        SetColor(color) {
            this.color = color;
            this.SetLightElement();
        }
        get Intensity() {
            return this.intensity;
        }
        set Intensity(intensity) {
            this.intensity = intensity;
            this.SetLightElement();
        }
        SetLightElement() {
            this.light.color.set(this.color);
            this.light.intensity = this.intensity;
            this.light.target.position.set(0, 0, 0);
        }
    }
    JWFramework.Light = Light;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=Light.js.map