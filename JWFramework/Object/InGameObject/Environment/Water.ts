import * as THREE from 'three';
import { Water as ThreeWater } from 'three/examples/jsm/objects/Water.js';
import { CollisionComponent } from '../../../Component/CollisionComponent';
import { ExportComponent } from '../../../Component/ExportComponent';
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
                sunDirection: new THREE.Vector3(1, 1, 0),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
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

    public Animate()
    {
        this.mesh.material.uniforms['time'].value += 1 * WorldManager.getInstance().GetDeltaTime();
    }
    private geometry: THREE.BufferGeometry;
    private mesh: ThreeWater;
    private reflectionScene: THREE.Scene = null;
}
