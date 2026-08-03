import * as THREE from 'three';
import { CameraManager } from '../../../Manager/CameraManager';
import { CameraMode, ObjectType, TerrainOption } from '../../../enum';
import { CollisionComponent } from '../../../Component/CollisionComponent';
import { ExportComponent } from '../../../Component/ExportComponent';
import { GameObject } from '../../GameObject';
import { GraphicComponent } from '../../../Component/GraphicComponent';
import { ObjectManager } from '../../../Manager/ObjectManager';
import { PhysicsComponent } from '../../../Component/PhysicsComponent';
import { SceneManager } from '../../../Manager/SceneManager';
import { ShaderManager } from '../../../Manager/ShaderManager';
import { WorldManager } from '../../../Manager/WorldManager';


export class HeightmapTerrain extends GameObject
{
    constructor(x: number, z: number, segmentWidth: number, segmentHeight: number, planSize: number = 900, isDummy: boolean = false)
    {
        super();
        this.isDummy = isDummy;
        this.width = x;
        this.height = z;
        this.planSize = planSize;
        this.segmentWidth = segmentWidth;
        this.segmentHeight = segmentHeight;
        this.name = "Terrain" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
        this.terrainIndex = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN].length;
        this.type = ObjectType.OBJ_TERRAIN;


        this.isClone = true;

        this.physicsComponent = new PhysicsComponent(this);
        this.graphicComponent = new GraphicComponent(this);
        this.exportComponent = new ExportComponent(this);
        this.collisionComponent = new CollisionComponent(this);

        this.CreateTerrainMesh();
    }

    public InitializeAfterLoad() {
        this.PhysicsComponent.SetPosition(this.width, 0, this.height);

        if (this.isDummy == false)
        {
            this.CreateBoundingBox();
        }
        this.GameObjectInstance.matrixAutoUpdate = false;
        SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
        //SceneManager.getInstance().SceneInstance.add(this.CollisionComponent.BoxHelper);
        ObjectManager.getInstance().AddObject(this, this.name, this.type);
    }

    public CreateBoundingBox() 
    {
        this.CollisionComponent.CreateBoundingBox(this.planSize, 5000, this.planSize);
        this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2000, this.height), new THREE.Vector3(this.planSize, 5000, this.planSize));
        this.CollisionComponent.BoxHelper.visible = false;
        this.CollisionComponent.BoxHelper.matrixAutoUpdate = false;
    }

    private CreateTerrainMesh()
    {
        if (this.isDummy == false)
            this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, this.segmentWidth, this.segmentHeight);
        else
            this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);

        // fog 유니폼은 UniformsLib 을 그대로 clone 해서 쓴다.
        //
        // 예전 코드는 `fogColor: { value: THREE.UniformsLib['fog'].fogColor }` 였는데,
        // 우변이 이미 `{ value: Color }` 라서 `{ value: { value: Color } }` 로 이중 래핑됐다.
        // 그러면 렌더러의 refreshFogUniforms() 가 `uniforms.fogColor.value.copy(fog.color)` 에서
        // TypeError 를 낸다 → 예전엔 three.js 본체를 `.copy()` → `=` 로 고쳐서 우회했고,
        // 그 대가로 three 버전을 못 올리게 됐다. CLAUDE.md §2① · §7.1
        //
        // clone 이므로 타일마다 자기 fog 유니폼을 갖는다(전역 UniformsLib 을 오염시키지 않는다).
        const customUniforms = {
            ...THREE.UniformsUtils.clone(THREE.UniformsLib['fog']),

            farmTexture: { value: ShaderManager.getInstance().farmTexture },
            mountainTexture: { value: ShaderManager.getInstance().mountainTexture },
            factoryTexture: { value: ShaderManager.getInstance().factoryTexture },
            cityTexture: { value: ShaderManager.getInstance().cityTexture },
            desertTexture: { value: ShaderManager.getInstance().desertTexture },

            cityUVFactor: { value: this.cityUVFactor },
            opacity: { value: this.opacity }
        };
        
        // create custom material from the shader code above
        //   that is within specially labelled script tags
        this.material = new THREE.ShaderMaterial(
            {
                uniforms: customUniforms,
                vertexShader: ShaderManager.getInstance().SplattingShader.vertexShader.slice(),
                fragmentShader: ShaderManager.getInstance().SplattingShader.fragmentShader.slice(),
                //wireframe: true,
                //side: THREE.DoubleSide,
                fog: true,
                transparent: false,
            });

        //this.material.map = this.texture;
        // this.gradientmap = new THREE.TextureLoader().load('Model/Heightmap/fiveTone.jpg');
        // this.gradientmap.minFilter = THREE.NearestFilter;
        // this.gradientmap.magFilter = THREE.NearestFilter;
        // this.material.gradientMap = this.gradientmap;

        //this.material.normalMap = new THREE.TextureLoader().load("Model/Heightmap/TerrainTexture_N.png");
        //this.material.wireframe = true;

        const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
        this.planeGeometry.applyMatrix4(rotation);

        this.planeGeometry.computeBoundingSphere();
        this.planeGeometry.computeVertexNormals();

        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.material);
        this.planeMesh.receiveShadow = true;
        this.planeMesh.castShadow = true;

        this.gameObjectInstance = this.planeMesh;
        this.GameObjectInstance.name = this.name;

        this.gameObjectInstance.frustumCulled = true;

        this.InitializeAfterLoad();
    }

    public get HeightIndexBuffer(): number[] {
        return this.heightIndexBuffer;
    }

    public get HeightBuffer(): number[] {
        this.heightBuffer.length = 0;
        this.heightIndexBuffer.forEach(element =>
            this.heightBuffer.push(this.planeGeometry.getAttribute('position').getY(element)));
        return this.heightBuffer;
    }

    private ApplyTextureUniform()
    {
        const shaderManager = ShaderManager.getInstance();
        this.material.uniforms.factoryTexture.value =
            this.useDirtTexture ? shaderManager.desertTexture : shaderManager.factoryTexture;
        this.material.uniforms.cityTexture.value =
            this.useCityTexture ? shaderManager.cityTexture : shaderManager.farmTexture;
    }

    public get IsDummy()
    {
        return this.isDummy;
    }

    public set IsDummy(flag: boolean)
    {
        this.isDummy = flag;
    }

    public SetHeight(index: number, value: number = undefined, option: TerrainOption = TerrainOption.TERRAIN_UP)
    {
        if (this.isDummy == true)
        {
            if (this.collisionComponent.BoundingBox != null)
            {
                this.collisionComponent.DeleteCollider();
                this.planeGeometry.dispose();
                this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                this.planeMesh.geometry = this.planeGeometry;
                const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                this.planeGeometry.applyMatrix4(rotation);
                //this.material.wireframe = true;
            }
        }
        this.planeGeometry.getAttribute('position').needsUpdate = true;
        let height: number = this.planeGeometry.getAttribute('position').getY(index);

        if (value != undefined && option == TerrainOption.TERRAIN_UP) {
            value = Math.abs(value);
        }

        if (option == TerrainOption.TERRAIN_DOWN) {
            value = Math.abs(value);
            value *= -1;
            this.planeGeometry.getAttribute('position').setY(index, height += value);
        }
        else if (option == TerrainOption.TERRAIN_BALANCE || option == TerrainOption.TERRAIN_LOAD) {
            this.planeGeometry.getAttribute('position').setY(index, value);
        }
        else {
            this.planeGeometry.getAttribute('position').setY(index, height += value);
        }
        if (this.isDummy == false) {
            const objectList = ObjectManager.getInstance().GetObjectList;
            const endPointIndex = this.planeGeometry.getAttribute('position').count - 1;
            const oldheight: number = this.planeGeometry.getAttribute('position').getY(index);

            if (this.planeGeometry.getAttribute('position').getX(index) == this.planSize / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index - this.segmentHeight, oldheight);

                    if (index == endPointIndex) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)]) {
                            const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(0, oldheight);
                        }
                    }

                    else if (index == this.segmentWidth) {
                        if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)]) {
                            const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)].GameObject;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                            (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(endPointIndex - this.segmentWidth, oldheight);
                        }
                    }
                }
            }

            if (this.planeGeometry.getAttribute('position').getX(index) == -(this.planSize / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - 1].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index + this.segmentHeight, oldheight);
                }

                if (index == 0) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)]) {
                        const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(endPointIndex, oldheight);
                    }
                }

                else if (index == endPointIndex - this.segmentWidth) {
                    if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)]) {
                        const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)].GameObject;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                        (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(this.segmentWidth, oldheight);
                    }
                }
            }

            // 인덱스는 i*row + j 이므로 z 방향 이웃은 ± row 다 (± col 이 아니다).
            // row == col == 20 이라 지금까지 우연히 맞았다.
            if (this.planeGeometry.getAttribute('position').getZ(index) == this.planSize / 2) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.row]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex + this.row].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index - (endPointIndex - this.segmentWidth), oldheight);
                }
            }

            if (this.planeGeometry.getAttribute('position').getZ(index) == -(this.planSize / 2)) {
                if (objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.row]) {
                    const terrain = objectList[ObjectType.OBJ_TERRAIN][this.terrainIndex - this.row].GameObject;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').needsUpdate = true;
                    (terrain as unknown as HeightmapTerrain).planeGeometry.getAttribute('position').setY(index + (endPointIndex - this.segmentWidth), oldheight);
                }
            }
        }

        if (this.heightIndexBuffer.indexOf(index) == -1)
            this.heightIndexBuffer.push(index);
        this.vertexNormalNeedUpdate = true;

        // 스캔은 집계만 하고 판정은 루프가 끝난 뒤 한 번만 한다.
        //
        // 예전에는 판정이 루프 안에 있어서 GetMaxVertex() 가 정점 수만큼(289회) 불렸다.
        // 그 함수는 자식 지오메트리의 정점을 전부 훑으므로 SetHeight 한 번이 289×289 였다.
        // 또 useDirtTexture 는 else 분기가 `이미 false 일 때만` false 를 넣어서
        // 한 번 켜지면 되돌릴 수 없었다 — 깎아서 사막이 되면 다시 올려도 그대로였다.
        const position = this.planeGeometry.getAttribute('position');
        const positionLength = position.count;
        let useDirt = false;
        let cnt = 0;
        for (let i = 0; i < positionLength; ++i)
        {
            const y = position.getY(i);
            if (y <= -3)
                useDirt = true;
            if (y == 1)
                ++cnt;
        }
        const useCity = (cnt >= 30 && this.physicsComponent.GetMaxVertex().y <= 110);

        if (this.useDirtTexture != useDirt || this.useCityTexture != useCity)
            this.textureUniformNeedUpdate = true;
        this.useDirtTexture = useDirt;
        this.useCityTexture = useCity;
        this.material.uniforms.cityUVFactor.value = useCity ? 6 : 1;
    }

    public CollisionActive(object: GameObject)
    {
        if (this.isDummy == false)
        {
            if (this.inSectorObject.includes(object) == false)
            {
                this.inSectorObject.push(object);
                //this.opacity = 0.5;
                //this.material.uniforms['opacity'].value = this.opacity;
                this.inSector = true;
            }
        }
    }

    public CollisionDeActive(object: GameObject) {
        if (this.inSectorObject.includes(object) == true) {
            this.inSectorObject = this.inSectorObject.filter((element) => (element != object)).slice();
        }
    }

    public Animate()
    {
        if (this.isDummy == true)
        {
            if (this.collisionComponent.BoundingBox != null)
            {
                this.collisionComponent.DeleteCollider(); 
                this.planeGeometry.dispose();
                this.planeGeometry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                this.planeMesh.geometry = this.planeGeometry;
                const rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                this.planeGeometry.applyMatrix4(rotation);
                //this.material.wireframe = true;
            }
        }
        else
        {
            // 플래그가 바뀐 프레임에만 대입한다. 예전엔 타일 324장이 매 프레임 4회씩 갈아끼웠다.
            if (this.textureUniformNeedUpdate)
            {
                this.ApplyTextureUniform();
                this.textureUniformNeedUpdate = false;
            }
            if (this.collisionComponent.BoundingBox == null)
                this.CreateBoundingBox();
        }

        if (this.vertexNormalNeedUpdate) {
            this.planeGeometry.computeVertexNormals();
            this.vertexNormalNeedUpdate = false;
        }
        this.inSectorObject = this.inSectorObject.filter((element) => (element.IsDead == false));
        if (this.inSectorObject.length == 0) {
            //this.opacity = 1;
            //this.material.uniforms['opacity'].value = this.opacity;
            this.inSector = false;
        }

        const cameraPosition = WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
        if (CameraManager.getInstance().CameraMode === CameraMode.CAMERA_3RD)
            WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
        if (cameraPosition.sub(this.physicsComponent.GetPosition()).length() > 4500)
        {
            this.GameObjectInstance.visible = false;
        }
        else
        {
            this.GameObjectInstance.visible = true;
        }

    }

    private planeMesh: THREE.Mesh;
    private planeGeometry: THREE.PlaneGeometry;
    private material: THREE.ShaderMaterial;

    private terrainIndex: number;
    private width: number;
    private height: number;
    private segmentWidth: number;
    private segmentHeight: number;

    private heightIndexBuffer: number[] = [];
    private heightBuffer: number[] = [];
    public inSectorObject: GameObject[] = [];

    private vertexNormalNeedUpdate: boolean = false;
    // 최초 1프레임에 한 번은 적용해야 한다 (생성 시 유니폼은 cityTexture 로 초기화된다).
    private textureUniformNeedUpdate: boolean = true;
    private opacity: number = 1;
    private cityUVFactor: number = 1;

    public row: number = 0;
    public col: number = 0;
    private isDummy = false;
    private planSize: number;
    public inSector: boolean = false
    private useDirtTexture: boolean = false;
    private useCityTexture: boolean = false;
}
