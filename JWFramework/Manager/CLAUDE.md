# Manager/ — 싱글턴 매니저

전부 `getInstance()` 싱글턴. 상호 참조가 많으므로 **초기화 순서**에 주의(`WorldManager.InitializeWorld()`가 기준점).

> 생성자가 `private`인 것은 `WorldManager`뿐. 나머지는 `public constructor()`라 실수로 `new` 할 수 있다 — 항상 `getInstance()`를 쓸 것.

| 파일 | 줄수 | 역할 |
|---|---:|---|
| [WorldManager.ts](WorldManager.ts) | 143 | 최상위. 렌더러/카메라/씬/델타타임 소유 |
| [ObjectManager.ts](ObjectManager.ts) | 267 | 전 오브젝트 저장소 + 프레임 갱신 + 클론/삭제/직렬화 |
| [SceneManager.ts](SceneManager.ts) | 66 | `THREE.Scene` 인스턴스 + 현재 씬 객체 보유 |
| [ModelLoadManager.ts](ModelLoadManager.ts) | 239 | GLTF 비동기 로드, 터레인 생성, `Scene.json` 로드 |
| [CollisionManager.ts](CollisionManager.ts) | 248 | 충돌 판정 6종 (상태 없음, 순수 함수 모음) |
| [InputManager.ts](InputManager.ts) | 134 | 키보드 이벤트 → DOWN/PRESS/UP 상태 머신 |
| [CameraManager.ts](CameraManager.ts) | 90 | 오빗 ↔ 3인칭 카메라 전환 |
| [GUIManager.ts](GUIManager.ts) | 41 | dat.GUI 패널 3종의 지연 생성 |
| [ShaderManager.ts](ShaderManager.ts) | 132 | 공용 텍스처 로드 + 모션블러 포스트프로세싱 체인 |
| [UnitConvertManager.ts](UnitConvertManager.ts) | 37 | 게임 유닛 ↔ 미터/km·h 변환 |

---

## WorldManager.ts

앱 부트스트랩. `Main.ts`가 유일한 호출자.

```
InitializeWorld()
  CreateRendere()      WebGLRenderer(canvas #c, alpha, antialias, highp, stencil)
                       shadowMap.enabled = true
  ResizeView()         canvas clientWidth/Height ↔ drawingBuffer 동기화. 변했으면 true 반환
  CreateMainCamera()   Camera "MainCamera" (fov 75, near 0.1, far 10000, pos 0,22,0)
  CreateScene()        SceneManager.BuildScene()
  CreateDeltaTime()    THREE.Clock
  renderer.compile() + 터레인/포그 텍스처 initTexture()   ← 첫 프레임 히칭 방지

Animate()   ResizeView → aspect 갱신 → delta 갱신 → MainCamera.Animate() → SceneManager.Animate()
Render()    renderer.render(scene, camera)
            ※ 모션블러 경로는 ShaderManager.ShadedRender() 로 주석 처리되어 있음
```

접근자: `Canvas`(= `renderer.domElement`), `MainCamera`, `Renderer`, `GetDeltaTime()`.

> `GetDeltaTime()`은 프레임 전체에서 쓰이는 시간 기준. 이동/회전은 전부 여기에 곱한다.

## ObjectManager.ts

```ts
objectList: ObjectSet[][]   // ObjectType 인덱스와 1:1인 8개 배열. 순서 변경 금지
objectId: number            // 클론 이름 suffix 카운터 (감소하지 않음)
```

| 메서드 | 비고 |
|---|---|
| `AddObject(obj, name, type)` | 목록에 push. `IsClone && !카메라`면 씬에도 add |
| `DetachObject(obj, type)` | 목록·씬에서만 제거 (dispose 안 함). 풀 반환용 |
| `GetObjectFromName(name)` | **전 타입 선형 탐색**. 핫패스에서 호출 주의 |
| `PickableObjectList` | 3D+2D+Water 중 클론이면서 이름에 `cloud`가 없는 것 |
| `MakeClone(proto)` | ★ `instanceof` 체인 — 새 클론 클래스는 여기에 추가. 애니메이션 있으면 `SkeletonUtils.clone` |
| `DeleteObject(obj)` | geometry/material dispose → 콜라이더 삭제 → 컴포넌트 해제 → 씬 remove |
| `DeleteAllObject()` | 카메라 제외 전 클론에 `IsDead = true` 표시만 (실삭제는 다음 `Animate()`) |
| `MakeJSONArray()` | `ExportComponent`로 직렬화 → `Scene.json` 다운로드 트리거 |
| `Animate()` | **게임 루프 본체** — 루트 `CLAUDE.md` §4.2 참조 |
| `GetInSectorTerrain()` | `cameraInSecter` 터레인을 `THREE.Group`에 모아 반환 (현재 미사용) |

> `Animate()`의 삭제 처리는 순회 중 배열을 `filter`로 재생성한다. 인덱스가 밀리므로 같은 프레임에 일부 오브젝트가 스킵될 수 있다.

## SceneManager.ts

`sceneThree: THREE.Scene`(렌더 대상)과 `scene: SceneBase`(로직)를 분리 보관.

`BuildScene()`이 `sceneType`을 `SCENE_EDIT`로 **하드코딩**하고 `EditScene`을 생성한다. 씬 전환 기능은 미구현(`SCENE_START` / `SCENE_STAGE` case가 비어 있음).

## ModelLoadManager.ts

```
LoadScene()           SceneType==SCENE_EDIT 이면 ModelSceneBase.getInstance("ModelSceneEdit") 목록 사용
                      각 ModelSet → LoadModel(), 이어서 LoadHeightmapTerrain(20,20)
LoadModel(modelSet)   async. mainUrl 있으면 GLTFLoad
                      lodUrl 있으면 THREE.LOD 구성 (main @300, lod @600)
                      → InitializeAfterLoad() → SetLoadComplete()
GLTFLoad(url)         Promise 래핑. traverse 하며 envMap/그림자/frustumCulled 설정
LoadHeightmapTerrain(row=20, col=20)
                      900 간격 그리드. 테두리는 isDummy=true. terrain[i].row/col 기록
LoadSavedScene()      fetch("./Model/Scene.json") → 이름 문자열 매칭으로 복원
```

**로드 완료 판정**: `loadCompletModel == modelCount` 이면 `LoadComplete = true`. `EditScene.Animate()`는 이 플래그가 서기 전엔 아무것도 하지 않는다.

> `LoadComplete` **getter가 부작용을 갖는다** — `SCENE_EDIT`일 때 `GUIManager.GUI_Select`를 건드려 패널을 지연 생성한다.
>
> `LoadSavedScene()`의 복원은 `data.name.includes("MIG_29" | "F-5E" | "Water" | "AIM-9")` **문자열 매칭 분기**다. 새 저장 대상 타입을 추가하면 여기에 분기를 넣어야 한다.

## CollisionManager.ts

상태 없는 판정 함수 모음. 파라미터 이름은 전부 `sorce`(원문 오타 유지) / `destination`.

| 메서드 | 입력 | 용도 |
|---|---|---|
| `CollideRayToTerrain(sorce)` | `ObjectSet[]`(terrain) | 각 터레인의 `inSectorObject`를 지면에 스냅. 거리<1이면 미사일은 `CollisionActive(OBJ_TERRAIN)` |
| `CollideRayToWater(sorce)` | `ObjectSet[]`(water) | 위와 동일 로직을 물 표면에 |
| `CollideSphereToBox(sorce, dst)` | `ObjectSet[]` | 실사용 주력. 오브젝트 sphere ↔ 터레인 AABB → 섹터 등록 |
| `CollideSphereToSphere(sorce, dst)` | `GameObject[]` | 같은 섹터 내 오브젝트끼리 |
| `CollideBoxToBox` / `CollideObbToObb` / `CollideObbToBox` | | 현재 호출부 주석 처리됨 |

레이 판정 폴백: 아래로 쏜 레이가 안 맞으면 **y=2000에서 다시 발사**해 지면을 찾는다.

## InputManager.ts

`keyCode` 숫자로 등록(deprecated API지만 그대로 유지). 등록 키: 방향키, space, delete, e o p q r w s f t u, 1~6.

```
keydown/keyup 이벤트 → KeySet.KeyEvent 토글 (즉시)
UpdateKey()  프레임 끝에서 전 키에 KeyPressedCheck() 적용
             KeyEvent && !이전 → KeyDown = true  (1프레임)
             KeyEvent && 이전  → KeyPressed = true
             !KeyEvent          → KeyUp

GetKeyState(name, KeyState.KEY_DOWN | KEY_PRESS | KEY_UP): boolean
```

새 키는 생성자에 `this.AddKey(코드, '이름')` 추가.

## CameraManager.ts

`cameraMode`: `CAMERA_ORBIT`(기본) / `CAMERA_3RD`.

```
ChangeThridPersonCamera()   Picker.GetPickParents() 대상에 카메라를 자식으로 add
                            OrbitControl.enabled = false
                            로컬 (0,0,0) 기준 Up*0.6, Look*-3.7 오프셋 (루프 2회 실행)
                            Water 는 대상 제외
ChangeOrbitCamera()         대상에서 카메라 remove, 대상 위 +15에 배치, target 세팅
```

> 3인칭 모드에서는 카메라가 부모의 로컬 공간에 있다. 월드 좌표가 필요하면 `MainCamera.CameraInstance.localToWorld(pos)` — `EditObject`, `HeightmapTerrain`, `LowCloud`가 모두 이 패턴을 쓴다.
>
> `PhysicsComponent.UpdateMatrix()`도 이 모드를 검사해 위치 계산 경로를 바꾼다.

## GUIManager.ts

`GUI_Select` / `GUI_SRT` / `GUI_Terrain`을 **getter 최초 접근 시 지연 생성**. `GUI_SRT`는 `"MainCamera"` 오브젝트로 초기화된다.

## ShaderManager.ts

생성자에서 공용 텍스처를 전부 로드(전부 `RepeatWrapping`):
`farmTexture` `mountainTexture` `factoryTexture` `cityTexture` `desertTexture` `fogTexture` `cloudTexture` `missileFlameTexture`

`BuildMotuinBlurShader()` — `EffectComposer` 체인 `RenderPass → BlendShader(mixRatio 0.0) → SavePass → CopyShader`. `ShadedRender()`로 렌더하지만 **현재 `WorldManager.Render()`에서 비활성**(`mixRatio`도 0).

`SplattingShader` 인스턴스도 여기서 보유 → `HeightmapTerrain`이 가져다 쓴다.

## UnitConvertManager.ts

```
ConvertToDistance(유닛)      → 미터        유닛 * 5760 / 900
ConvertToSpeedForKmh(유닛)   → km/h (반올림) (미터 / deltaTime) * 3.6
```