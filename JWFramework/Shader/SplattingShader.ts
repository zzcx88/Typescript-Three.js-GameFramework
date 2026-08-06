
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
        Position = vec4(position,1.0);
       }
     `

        this.fragmentShader =
            `
     #include <fog_pars_fragment>

     uniform sampler2D farmTexture;
     uniform sampler2D mountainTexture;
     uniform sampler2D factoryTexture;
     uniform sampler2D cityTexture;
     uniform sampler2D desertTexture;
     uniform float opacity;
     uniform float cityUVFactor;

     varying vec2 vUV;
     varying vec4 Position;

     void main() 
     {
        vec4 factory = vec4(0.0);
        vec4 farm = vec4(0.0);
        vec4 city = vec4(0.0);
        vec4 mountain = vec4(0.0);
        vec4 desert = vec4(0.0);

        factory = (smoothstep(-2.f, -1.f, Position.y) - smoothstep(-1.f, 0.f, Position.y)) * texture2D( factoryTexture, vUV * 9.5 );
        factory[3] = 0.0;
        farm = (smoothstep(-1.f, 0.f, Position.y) - smoothstep(0.f, 1.f, Position.y)) * texture2D( farmTexture, vUV * 1.0 );
        farm[3] = 0.0;
        city = (smoothstep(0.f, 1.f, Position.y) - smoothstep(1.f, 2.f, Position.y)) * texture2D( cityTexture, vUV * cityUVFactor );
        city[3] = 0.0;
        mountain = (smoothstep(1.f, 2.f, Position.y) - smoothstep(2.f, 1200.f, Position.y)) * texture2D( mountainTexture, vUV * 5.0);
        mountain[3] = 0.0;
        desert = (smoothstep(-1.f, -2.f, Position.y) - smoothstep(-2.f, -1200.f, Position.y)) * texture2D( desertTexture, vUV * 10.0 );
        desert[3] = 0.0;

        gl_FragColor = vec4(0.0, 0.0, 0.0, opacity) + farm + mountain + factory + city + desert;

        // 커스텀 ShaderMaterial 은 내장 셰이더와 달리 출력 변환이 자동으로 붙지 않는다.
        // (linearToOutputTexel() 은 프리픽스에 주입되지만 호출부가 없다 — WebGLProgram.js)
        // 인클루드 순서는 내장 셰이더와 동일하게 맞춘다: 톤매핑 → 색공간 → 포그.
        // 포그가 색공간 뒤에 오는 것은 three 가 fogColor 를 출력 색공간으로 넘기기 때문이다.
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
     }
     `
    }

    public vertexShader: string;
    public fragmentShader: string;
}
