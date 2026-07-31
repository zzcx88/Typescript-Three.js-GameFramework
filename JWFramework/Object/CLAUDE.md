# Object/ — GameObject 계층

## 상속 트리

```
GameObject                       (GameObject.ts)  Three.js Object3D를 "소유"하는 베이스
├─ Camera                        Camera/Camera.ts
├─ Light                         Light/Light.ts
├─ HeightmapTerrain              CommonObject/Terrain/HeightmapTerrain.ts
├─ EditObject                    EditObject/EditObject.ts        ★ 에디터 주력 오브젝트
├─ TestCube                      EditObject/TestCube.ts          (사실상 미사용)
├─ AircraftObject                InGameObject/AircraftObject.ts  (스로틀/애프터버너 골격만)
│   └─ F16Object                 InGameObject/F16Object.ts       (StageScene용, 현재 비활성)
├─ Missile                       InGameObject/Weapons/Missile.ts ★ 비례항법 유도
│   ├─ AIM9H                     .../IRMissile/AIM9H.ts          OBB 콜라이더
│   ├─ AIM9L                     .../IRMissile/AIM9L.ts
│   └─ R60M                      .../IRMissile/R60M.ts           Sphere 콜라이더
├─ Water                         InGameObject/Envirument/Water.ts
├─ Cloud                         InGameObject/Envirument/Cloud.ts   (Mesh 클론 30개)
├─ LowCloud                      InGameObject/LowCloud.ts           (InstancedMesh 200개)
├─ MissileFog                    InGameObject/MissileFog.ts         ★ 유일한 풀링 대상
├─ ObjectLabel                   InGameUI/ObjectLabel.ts            캔버스 텍스처 빌보드
└─ IRCircle                      InGameUI/IRCircle.ts               (링 메시, 현재 미사용)
```

> 폴더명 `Envirument`는 오타지만 그대로 유지한다.

## GameObject.ts — 베이스 계약

**오버라이드 훅** (베이스는 전부 빈 구현):

| 훅 | 호출 시점 |
|---|---|
| `InitializeAfterLoad()` | 모델 로드 완료 후 / 클론 생성 직후. `IsClone` 분기 필수 |
| `Animate()` | 매 프레임, `IsClone == true`일 때만 (`ObjectManager.Animate()`) |
| `CollisionActive(value?)` / `CollisionDeActive(value?)` | `CollisionManager`가 호출. 인자 타입이 구현마다 다름(아래 주의) |
| `Reset()` | `ObjectPool.ReleaseObject()` |

**상태 플래그**

| 플래그 | 의미 |
|---|---|
| `IsClone` | `false` = 복제 원본(프로토타입, 씬에 없음) / `true` = 실제 씬 인스턴스 |
| `IsDead` | `true`로 세우면 다음 `ObjectManager.Animate()`에서 파괴됨 |
| `Picked` | `Picker`가 세움. `EditObject`는 이때만 조작 입력을 받는다 |
| `IsRayOn` | 지면 스냅 레이캐스트 대상 여부 |
| `IsPlayer` | `GUI_SRT`에서 지정. `F16Object`가 사용 |
| `IsPoolObject` | `MissileFog` 풀 관리용 |

**소유 필드**: `gameObjectInstance`(Three.js 노드), `modelData`(GLTF), `type`, `name`, `animationMixer`, 컴포넌트 5종.

`DeleteAllComponent()` — 전 컴포넌트 해제. `GUIComponent`만 `Dispose()`를 먼저 부른다.

> ⚠️ `CollisionActive`의 시그니처가 구현마다 다르다:
> `HeightmapTerrain.CollisionActive(object: GameObject)` / `Missile.CollisionActive(type: ObjectType)` / `EditObject.CollisionActive()`.
> 베이스가 `value: any = 0`이라 컴파일은 통과한다. `CollisionManager`의 어느 함수가 무엇을 넘기는지 확인하고 구현할 것.

---

## 주요 클래스

### EditObject.ts (270줄) — 에디터에서 배치·조종하는 오브젝트

컴포넌트 5종 전부 보유. `MIG_29` / `Tree` / `F-5E` / `Animation` 모델이 전부 이 클래스로 인스턴스화된다.

```
InitializeAfterLoad()
  IsClone == false → ObjectManager.AddObject (프로토타입 등록)
  IsClone == true  → GUI_SRT.DefaultEditableBounding 에 따라
                       true : SRT 패널의 기본 회전/스케일 적용 + OBB 생성
                       false: CreateCollider() → Sphere(r=5) + Raycaster
                     SCENE_EDIT 이면 AxesHelper(10) 부착 + GUIComponent.GetLabel()

Animate()
  LabelOnOff()          카메라 거리 3000 초과 → 라벨/OBB헬퍼/본체 visible=false
  TargetTest()          isTarget이면 스로틀 50 + Up축 자동 선회 (미사일 표적 더미)
  Picked == true 일 때
    IsRayOn = true
    MoveFoward(throttle)
    SpeedIndicaterProcess()   이전 프레임 대비 이동거리 → km/h → #speed DOM 갱신
    InputProcess()            기즈모 Off일 때만 비행 조작
    SeekerProcess()           "Target"과의 각도 ≤10° 이면 canLaunch = true
  Picked == false 일 때 → IsRayOn = false, throttle = 0
  EditHelperProcess()   기즈모 attach/detach + AxesHelper 거리 비례 스케일
  CollisionComponent.Update()
  AnimationMixer.update(delta)
```

조작(기즈모 Off): 방향키 = 롤(Look축) / 피치(Right축), `W`/`S` = 스로틀 0~100, `F`/`R` = 3인칭 진입/해제, `Space` = `launchMissile()`(`canLaunch`일 때 R-60M 클론 발사), `P` = 자신을 `"Target"`으로 명명.

### HeightmapTerrain.ts (384줄) — 지형 타일

생성자가 `CreateTerrainMesh()` → `InitializeAfterLoad()`까지 **동기적으로 끝낸다**(로더를 거치지 않음).

```
일반 타일 : PlaneGeometry(planSize=900, 900, 16, 16) + SplattingShader ShaderMaterial
더미 타일 : PlaneGeometry(900, 900, 1, 1), 콜라이더 없음  ← 그리드 테두리 및 6키로 지정
공통      : X축 -90° 회전 적용, matrixAutoUpdate = false
콜라이더  : Box3 (900 × 5000 × 900), 중심 y=2000. 헬퍼는 invisible
```

**`SetHeight(index, value, option)`** — 이 클래스의 핵심.

- `TERRAIN_UP` : `height += |value|` · `TERRAIN_DOWN` : `height -= |value|` · `TERRAIN_BALANCE` / `TERRAIN_LOAD` : `height = value`
- 수정한 정점이 타일 경계(`x == ±planSize/2`, `z == ±planSize/2`)면 **인접 타일의 대응 정점도 같이 갱신**해 이음매를 맞춘다. 이웃 인덱스는 `terrainIndex ± 1`, `± row`, `± col`, `± (row±1)`로 계산.
- 수정된 인덱스는 `heigtIndexBuffer`에 누적 → `ExportComponent`가 `vertexIndex`/`vertexHeight`로 직렬화.
- 끝에서 **전 정점을 순회**하며 `useDirtTexture`(y ≤ -3) / `useCityTexture`(y == 1인 정점 30개 이상 && maxY ≤ 110) 판정 → 셰이더 유니폼 교체. **비싼 루프** — 브러시 드래그 중 매 픽마다 돈다.

```
Animate()
  더미면 → 콜라이더/지오메트리 정리 (1×1로 되돌림)
  아니면 → 텍스처 유니폼 갱신, 콜라이더 없으면 재생성
  vertexNormalNeedUpdate 면 computeVertexNormals()
  inSectorObject 에서 죽은 객체 제거, 비면 inSecter = false
  카메라 거리 4500 초과 → visible = false
```

**섹터링**: `CollideSphereToBox`가 오브젝트를 이 타일의 `inSectorObject`에 등록/해제한다. 이 목록이 지면 스냅(`CollideRayToTerrain`)과 오브젝트 간 충돌(`CollideSphereToSphere`)의 광역 페이즈 역할을 한다.

### Missile.ts (199줄) + IRMissile/

`Missile`이 유도·추진을 전부 담당하고, 파생 클래스는 **파라미터와 콜라이더만** 다르게 준다.

```
Animate()  targetObject("Target") 이 있으면
  거리 < 100                    → activeColide = true
  거리 ≥ endHomingStartLenge    → predictionDistance = 거리/2  (리드 추적)
  rotaspeed 를 rotateSpeedAcceletion 으로 maxRotateSpeed 까지 가속
  nextPos = 표적위치 + 표적Look * predictionDistance
  angle/axis 로 Quaternion 회전, 회전속도는 (angle / this.angle) 비례
  가속: velocity += velocityGain*dt → resultSpeed = aircraftSpeed + velocity
  maxResultSpeed 도달 → deAcceleration = true → velocityBreak 로 감속
  resultSpeed ≤ 60 && 감속중    → IsDead = true  (자연 소멸)
  MoveFoward(resultSpeed)
  풀에서 MissileFog 꺼내 궤적 연기 배치
```

| 클래스 | velocityGain | velocityBreak | maxRotateSpeed | rotateSpeedAcceletion | endHoming | 콜라이더 |
|---|---:|---:|---:|---:|---:|---|
| `AIM9H` | 40 | 1 | 18 | 5 | 100 | OBB(1.5³) |
| `AIM9L` | 40 | 1.5 | 30 | 15 | 50 | OBB(1.5³) |
| `R60M` | 30 | 2 | 30 | 20 | 50 | Sphere(r=2) |

(`maxVelocity`는 셋 다 80. `endHoming`은 상대속도 우세일 때만 적용되고, 아니면 0)

발사체는 스프라이트 화염(`missileFlameMesh`)을 자식으로 붙인다. `CollisionActive(OBJ_TERRAIN)` → `IsDead`.

> ⚠️ 파생 클래스들의 `Animate()`는 `(this.targetObject as EditObject).throttle`을 **null 체크 없이** 읽는다. `"Target"` 오브젝트가 없는 상태로 발사하면 터진다.

### MissileFog.ts — 유일한 풀링 대상

`EditScene.missileFogPool`에 500개 사전 생성. `Missile.Animate()`가 매 프레임 하나씩 꺼내 배치한다.

```
Animate()  → FogStateUpdate() 제너레이터를 next() 한 번 호출
             currentTime += 5*dt → 스케일 확대, opacity -= 0.5*dt
             opacity ≤ 0 → pool.ReleaseObject(this)
Reset()    → ObjectManager.DetachObject, currentTime=0, opacity=0.8, scale 0.5
```

> 제너레이터는 매 프레임 새로 만들어 한 번만 `next()` 한다 — 사실상 일반 함수와 동일하다. 상태 머신 실험 흔적.

### 환경 오브젝트

| 클래스 | 구현 |
|---|---|
| `Water` | `THREE.Water` (512² 반사, 노멀맵 `Object/InGameObject/Envirument/waternormals.jpg`). `Animate()`는 `uniforms.time`만 증가. `IsClone == true`일 때만 컴포넌트/메시 생성 |
| `Cloud` | `"Cloud"` 프로토타입 메시를 30개 클론해 자식으로 붙임. 겹치지 않게 재추첨(`do...while`). 반투명·`depthWrite: false`·`renderOrder: -1` |
| `LowCloud` | `InstancedMesh` 200개. `Animate()`에서 **매 프레임 전 인스턴스의 빌보드 행렬 재계산**(카메라 거리 200 이내면 이전 행렬 유지). 카메라 거리 6000 초과 시 통째로 숨김 |

`EditScene.MakeSceneCloud()`가 `LowCloud` 30덩이를 랜덤 배치한다(= 인스턴스 6000개).

### UI / 기타

- **`ObjectLabel`** — 캔버스에 텍스트를 그려 `CanvasTexture` → `Sprite`. `sizeAttenuation: false`, `depthTest: false`. `referenceObject`를 따라다니며, 이름이 `"Target"`이면 선택된 오브젝트와의 거리를 m/km로 표시(`MakeCanvasTexture` 재호출로 텍스처 갱신).
- **`Camera`** — `PerspectiveCamera` 래핑. `Fov`/`Aspect`/`Near`/`Far` setter가 `updateProjectionMatrix()`까지 처리. AABB(300×1×300)를 갖는다.
  > ⚠️ `get Near()`가 `this.Near`를 반환한다 — **무한 재귀**. 현재 호출부가 없어 드러나지 않음.
- **`Light`** — `DirectionalLight` / `AmbientLight` 래핑. `SetColor()` / `Intensity`.
- **`IRCircle`**, **`TestCube`**, **`AircraftObject`/`F16Object`** — 현재 씬에서 생성되지 않는 미완/보류 코드.

---

## 새 GameObject 추가 절차

1. `GameObject` 상속, 생성자에서 `this.type` 설정 + 필요한 컴포넌트만 생성
2. `InitializeAfterLoad()`에 `IsClone` 분기 작성 (false → `AddObject`만, true → 콜라이더/헬퍼 생성)
3. 클론 대상이면 **`Manager/ObjectManager.ts`의 `MakeClone()` `instanceof` 체인에 추가**
   현재 순서: `EditObject → AIM9H → AIM9L → R60M → Cloud → Water`.
   `instanceof`는 상속을 타므로 **파생 클래스는 반드시 부모보다 앞에** 넣어야 한다
   (예: `EditObject`를 상속한 새 클래스를 뒤에 넣으면 항상 `EditObject`로 복제된다).
   빠뜨리면 런타임에 `alert("... Instance of class name not found")`.
4. GLTF 로드가 필요하면 `define.ts`의 `ModelSceneEdit.sceneModelData`에 `{ model, mainUrl, lodUrl }` 등록 + 프로토타입 필드에 `Name` 지정
5. `Animate()`에서 콜라이더를 쓰면 `this.CollisionComponent.Update()` 호출
6. 별도 등록 절차 없음 — 쓰는 쪽에서 import하면 번들에 들어간다. `npm run lint:fix`로 `import type` 승격
