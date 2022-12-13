declare namespace JWFramework {
    class Light extends GameObject {
        constructor();
        get Color(): number;
        SetColor(color: number): void;
        get Intensity(): number;
        set Intensity(intensity: number);
        private SetLightElement;
        private color;
        private intensity;
        private light;
    }
}
