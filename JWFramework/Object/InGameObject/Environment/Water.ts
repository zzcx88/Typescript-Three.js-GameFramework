import * as THREE from 'three';
import { Water as ThreeWater } from 'three/examples/jsm/objects/Water.js';
import { CollisionComponent } from '../../../Component/CollisionComponent';
import { ExportComponent } from '../../../Component/ExportComponent';
import { GUI_Color } from '../../../GUI/GUIControls/GUI_Color';
import { GameObject } from '../../GameObject';
import { GraphicComponent } from '../../../Component/GraphicComponent';
import { ObjectManager } from '../../../Manager/ObjectManager';
import { ObjectType } from '../../../enum';
import { PhysicsComponent } from '../../../Component/PhysicsComponent';
import { WorldManager } from '../../../Manager/WorldManager';


export class Water extends GameObject
{
    constructor()
    {
        super();
        this.type = ObjectType.OBJ_WATER;
        this.name = "Water"
    }

    public InitializeAfterLoad()
    {
        if (this.IsClone == true)
        {
            this.graphicComponent = new GraphicComponent(this);
            this.physicsComponent = new PhysicsComponent(this);
            this.exportComponent = new ExportComponent(this);
            this.collisionComponent = new CollisionComponent(this);
            this.CreateWaterMesh();
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.GameObjectInstance.name = this.name;
            GUI_Color.RegisterWater(this);
        }
        else
        {
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
    }

    private CreateWaterMesh()
    {
        this.geometry = new THREE.PlaneGeometry(900, 900, 4, 4);
        this.mesh = new ThreeWater(
            this.geometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('Object/InGameObject/Environment/waternormals.jpg', function (texture)
                {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                // Water.js 의 물빛은 두 항의 합이다 (벤더 셰이더 기준).
                //   albedo = sunColor * diffuseLight * 0.3  +  dot(N,E) * waterColor
                //            └── 무채색 바닥 ────────────┘     └── 색조 ──────────┘
                //
                // waterColor 는 **더하기만** 하므로 이것만으로는 어둡게 만들 수 없다.
                // 검푸른 바다처럼 어둡고 진한 색을 내려면 바닥부터 낮춰야 하고,
                // 그 레버가 sunColor 다 — diffuseLight 가 이미 sunColor 를 품고 있어
                // **제곱으로** 듣는다. 바닥 = sunColor^2 * dot(sunDir, N) * 0.5 * 0.3
                //
                // 벤더는 sunDirection 을 정규화하지 않고 그대로 dot() 에 쓴다(Water.js:231).
                // 예전 값 (1,1,0) 은 길이가 1.414 라 바닥이 41% 부풀어 있었다 → 정규화.
                //
                // 아래 두 값은 GUI_Color 로 눈으로 맞춰 확정한 것이다.
                // 바닥이 0.020 → 0.029 로 오르고 waterColor 의 청색 기여가 0.107 → 0.031 로
                // 내려가, 이전(39,55,100)보다 밝고 채도가 낮은 — 청록보다 잿빛에 가까운 — 바다다.
                // 결과 선형값 약 (0.032, 0.032, 0.060) → 화면 RGB 약 (50, 50, 69)
                // 위는 수면을 정면에서 내려다볼 때(dot(N,eye)≈1) 기준이고,
                // 스침각으로 갈수록 색조 항이 사라져 무채색 바닥만 남는다.
                sunDirection: new THREE.Vector3(0.70707, 0.70707, 0),
                sunColor: 0xc0c0c0,
                waterColor: 0x080831,
                distortionScale: 2,
                fog: true
            }
        );

        this.mesh.name = "WaterMesh";
        this.mesh.rotation.x = -Math.PI / 2;
        this.GameObjectInstance = this.mesh;

        this.OverrideReflectionScene();
    }

    /**
     * 물 반사에 **스카이박스만** 비치게 한다 (지형·오브젝트는 반사되지 않는다).
     *
     * 예전에는 `Lib/Three/Object/Water.js` 안의 `renderer.render(scene, mirrorCamera)` 를
     * 직접 고쳐서 구현했다 → three.js 를 갈아끼울 수 없게 되는 원인이었다.
     *
     * 벤더 `Water.onBeforeRender` 는 `scene` 인자를 **오직 `renderer.render(scene, mirrorCamera)`
     * 한 곳에서만** 쓴다(r134 확인). 따라서 인자만 반사 전용 씬으로 바꿔 넘기면
     * 라이브러리를 건드리지 않고 같은 결과를 얻는다. CLAUDE.md §7.1
     */
    private OverrideReflectionScene()
    {
        const vendorOnBeforeRender = this.mesh.onBeforeRender;
        this.mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) =>
        {
            vendorOnBeforeRender.call(
                this.mesh, renderer, this.GetReflectionScene(scene), camera, geometry, material, group);
        };
    }

    private GetReflectionScene(scene: THREE.Scene): THREE.Scene
    {
        if (this.reflectionScene == null)
        {
            this.reflectionScene = new THREE.Scene();
            this.reflectionScene.background = scene.background;
            // environment 는 Texture 만 받는다 (background 는 Texture | Color | null).
            // 실제로 들어오는 건 EditScene 이 세팅한 스카이박스 CubeTexture 다.
            if (scene.background instanceof THREE.Texture)
                this.reflectionScene.environment = scene.background;
            // 라이트는 원본 씬과 공유한다.
            // add() 를 쓰면 원본 씬에서 떨어져 나가므로 children 을 직접 채운다.
            this.reflectionScene.children = scene.children.filter(o_ => (o_ instanceof THREE.Light)).slice();
        }
        return this.reflectionScene;
    }

    /** 색 조정 임시 패널(GUI_Color)용. Color.set() 이 sRGB → 선형 변환까지 처리한다. */
    public SetSunColor(hex: number)
    {
        this.mesh.material.uniforms['sunColor'].value.set(hex);
    }

    public SetWaterColor(hex: number)
    {
        this.mesh.material.uniforms['waterColor'].value.set(hex);
    }

    public Animate()
    {
        this.mesh.material.uniforms['time'].value += 1 * WorldManager.getInstance().GetDeltaTime();
    }
    private geometry: THREE.BufferGeometry;
    private mesh: ThreeWater;
    private reflectionScene: THREE.Scene = null;
}
