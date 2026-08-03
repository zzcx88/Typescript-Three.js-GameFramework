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

    /** 타일 내 최대 정점 높이(로컬 y). 격자 DDA 의 조기 탈출이 쓸 값이다. */
    public get MaxHeight(): number {
        return this.maxHeight;
    }

    public get TerrainIndex(): number {
        return this.terrainIndex;
    }

    /**
     * 격자 제원. ModelLoadManager.LoadHeightmapTerrain() 이 한 번 세운다.
     *
     * 타일이 규칙적으로 놓이므로 월드 좌표에서 인덱스를 바로 구할 수 있다.
     * 예전에는 오브젝트마다 타일 324장 전부와 sphere-box 를 검사해서 자기 타일을 찾았다.
     */
    public static SetGridInfo(row: number, col: number, tileSize: number)
    {
        HeightmapTerrain.gridRow = row;
        HeightmapTerrain.gridCol = col;
        HeightmapTerrain.gridTileSize = tileSize;
    }

    /** 월드 축 좌표 → 격자 축 인덱스. 타일 j 는 [tileSize*j - tileSize/2, + tileSize/2) 를 덮는다. */
    public static WorldToGridAxis(value: number): number
    {
        const tileSize = HeightmapTerrain.gridTileSize;
        return Math.floor((value + tileSize / 2) / tileSize);
    }

    /** 격자 (i, j) → objectList[OBJ_TERRAIN] 인덱스. 격자 밖이면 -1. */
    public static GridToTerrainIndex(i: number, j: number): number
    {
        if (i < 0 || i >= HeightmapTerrain.gridCol || j < 0 || j >= HeightmapTerrain.gridRow)
            return -1;
        return i * HeightmapTerrain.gridRow + j;
    }

    /** 광역 페이즈가 매 프레임 다시 채우므로 그 전에 비운다. */
    public ClearSector()
    {
        this.inSectorObject.length = 0;
        this.inSector = false;
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
        const position = this.planeGeometry.getAttribute('position');
        position.needsUpdate = true;
        let height: number = position.getY(index);

        if (value != undefined && option == TerrainOption.TERRAIN_UP) {
            value = Math.abs(value);
        }

        if (option == TerrainOption.TERRAIN_DOWN) {
            value = Math.abs(value);
            value *= -1;
            position.setY(index, height += value);
        }
        else if (option == TerrainOption.TERRAIN_BALANCE || option == TerrainOption.TERRAIN_LOAD) {
            position.setY(index, value);
        }
        else {
            position.setY(index, height += value);
        }
        if (this.isDummy == false) {
            const endPointIndex = position.count - 1;
            const oldheight: number = position.getY(index);

            if (position.getX(index) == this.planSize / 2) {
                // 대각 이웃은 가로 이웃이 있을 때만 따진다 (원래 중첩 구조 유지).
                if (this.SyncNeighborVertex(this.terrainIndex + 1, index - this.segmentHeight, oldheight)) {
                    if (index == endPointIndex)
                        this.SyncNeighborVertex(this.terrainIndex + (HeightmapTerrain.gridRow + 1), 0, oldheight);
                    else if (index == this.segmentWidth)
                        this.SyncNeighborVertex(this.terrainIndex - (HeightmapTerrain.gridRow - 1), endPointIndex - this.segmentWidth, oldheight);
                }
            }

            if (position.getX(index) == -(this.planSize / 2)) {
                this.SyncNeighborVertex(this.terrainIndex - 1, index + this.segmentHeight, oldheight);

                if (index == 0)
                    this.SyncNeighborVertex(this.terrainIndex - (HeightmapTerrain.gridRow + 1), endPointIndex, oldheight);
                else if (index == endPointIndex - this.segmentWidth)
                    this.SyncNeighborVertex(this.terrainIndex + (HeightmapTerrain.gridRow - 1), this.segmentWidth, oldheight);
            }

            // 인덱스는 i*row + j 이므로 z 방향 이웃은 ± row 다 (± col 이 아니다).
            // row == col == 20 이라 지금까지 우연히 맞았다.
            if (position.getZ(index) == this.planSize / 2)
                this.SyncNeighborVertex(this.terrainIndex + HeightmapTerrain.gridRow, index - (endPointIndex - this.segmentWidth), oldheight);

            if (position.getZ(index) == -(this.planSize / 2))
                this.SyncNeighborVertex(this.terrainIndex - HeightmapTerrain.gridRow, index + (endPointIndex - this.segmentWidth), oldheight);
        }

        if (this.heightIndexBuffer.indexOf(index) == -1)
            this.heightIndexBuffer.push(index);

        // 집계는 여기서 하지 않는다. 프레임당 한 번 Animate() 에서 처리한다 — UpdateHeightStats() 주석 참조.
        this.vertexNormalNeedUpdate = true;
    }

    /**
     * 이웃 타일의 대응 정점을 같은 높이로 맞춰 이음매를 없앤다.
     *
     * 이웃이 없으면 아무것도 하지 않고 false 를 반환한다 — 호출부의 중첩 조건이 이 값을 쓴다.
     *
     * 예전에는 정점만 쓰고 이웃의 vertexNormalNeedUpdate 를 세우지 않아서,
     * 이음매 정점이 움직여도 이웃 타일의 법선이 다시 계산되지 않았다(경계에 조명 이음매).
     * 이제는 바운딩 스피어와 높이 집계도 그 플래그에 물려 있으므로 반드시 세워야 한다.
     */
    private SyncNeighborVertex(neighborIndex: number, vertexIndex: number, height: number): boolean
    {
        const objectSet = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_TERRAIN][neighborIndex];
        if (objectSet == undefined)
            return false;

        const neighbor = objectSet.GameObject as unknown as HeightmapTerrain;
        const neighborPosition = neighbor.planeGeometry.getAttribute('position');
        neighborPosition.needsUpdate = true;
        neighborPosition.setY(vertexIndex, height);
        neighbor.vertexNormalNeedUpdate = true;
        return true;
    }

    /**
     * 정점 높이에서 파생되는 값을 한 번의 순회로 모두 갱신한다.
     *
     * 예전에는 SetHeight 가 호출될 때마다 전 정점을 순회했고, 그 루프 안에서
     * GetMaxVertex() 를 불러 다시 전 정점을 훑었다 → 호출 1회가 289×289.
     * Picker 는 face.a/b/c 로 3번 부르고 브러시 드래그는 매 프레임이라 실측 렉의 주범이었다.
     *
     * 지금은 SetHeight 가 플래그만 세우고, 실제 집계는 프레임당 한 번 여기서 한다.
     * computeVertexNormals() 가 어차피 전 정점을 훑는 자리이므로 추가 비용이 사실상 없다.
     */
    private UpdateHeightStats()
    {
        const position = this.planeGeometry.getAttribute('position');
        const count = position.count;
        let useDirt = false;
        let cnt = 0;
        let maxY = -Infinity;

        for (let i = 0; i < count; ++i)
        {
            const y = position.getY(i);
            if (y <= -3)
                useDirt = true;
            if (y == 1)
                ++cnt;
            if (y > maxY)
                maxY = y;
        }
        this.maxHeight = maxY;

        const useCity = (cnt >= 30 && maxY <= 110);
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

        // 정점 높이가 바뀐 프레임에만 파생 값을 한꺼번에 다시 만든다.
        //
        // computeBoundingSphere() 가 여기 없으면 생성 시의 값(평평한 타일 기준 반지름 약 636)이
        // 계속 쓰인다. 모서리 정점이 이미 그 반지름에 걸쳐 있어서 조금만 높여도 스피어 밖으로
        // 나가고, three 는 프러스텀 컬링과 Mesh.raycast 조기 탈출에 같은 스피어를 쓴다
        // → 높인 봉우리가 화면에서 사라지거나 찍히지 않는다.
        if (this.vertexNormalNeedUpdate) {
            this.planeGeometry.computeVertexNormals();
            this.planeGeometry.computeBoundingSphere();
            if (this.isDummy == false)
                this.UpdateHeightStats();
            this.vertexNormalNeedUpdate = false;
        }
        // 죽은 오브젝트를 걸러내던 filter 는 없앴다. 광역 페이즈가 매 프레임
        // ClearSector() 로 비우고 다시 채우므로 살아 있는 것만 들어온다.
        // (타일마다 배열을 새로 만들던 자리라 프레임당 최대 400개 할당이 사라졌다.)

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
    private maxHeight: number = 0;

    // 격자 제원은 전 타일이 공유한다. SetGridInfo() 가 한 번 세운다.
    private static gridRow: number = 0;
    private static gridCol: number = 0;
    private static gridTileSize: number = 900;

    private isDummy = false;
    private planSize: number;
    public inSector: boolean = false
    private useDirtTexture: boolean = false;
    private useCityTexture: boolean = false;
}
