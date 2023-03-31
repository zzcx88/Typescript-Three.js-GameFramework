namespace JWFramework {
    export class SplattingShader {
        public constructor() {
            this.vertexShader =
                `
         #include <fog_pars_vertex>
         varying vec2 vUV;
         varying vec4 Position;

         void main() {
            #include <begin_vertex>
            #include <project_vertex>
            #include <fog_vertex>
            vUV = uv;
            gl_Position = projectionMatrix * modelViewMatrix  * vec4(position,1.0);
            Position = vec4(position,1.0);
         
           }
         `

            this.fragmentShader =
                `
         #include <fog_pars_fragment>

         uniform sampler2D farmTexture;
         uniform sampler2D mountainTexture;
         uniform sampler2D factoryTexture;
         uniform float opacity;
         uniform float uvCell;

         varying vec2 vUV;
         varying vec4 Position;

         void main() 
         {
            vec4 factory = (smoothstep(-2.f, -1.f, Position.y) - smoothstep(-1.f, 0.f, Position.y)) * texture2D( factoryTexture, vUV * 10.0 );
            factory[3] = 0.0;
            vec4 farm = (smoothstep(-1.f, 0.f, Position.y) - smoothstep(0.f, 1.f, Position.y)) * texture2D( farmTexture, vUV * 1.0 );
            farm[3] = 0.0;
            vec4 mountain = (smoothstep(0.f, 1.f, Position.y) - smoothstep(1.f, 1200.f, Position.y)) * texture2D( mountainTexture, vUV * 5.0 );
            mountain[3] = 0.0;
            gl_FragColor = vec4(0.0, 0.0, 0.0, opacity) + farm + mountain + factory;

            #include <fog_fragment>
         }  
         `
        }

        public vertexShader: string;
        public fragmentShader: string;
    }
}