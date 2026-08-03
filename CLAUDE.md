# JWFramework — TypeScript + Three.js 게임 프레임워크

## 프로젝트 목표

**브라우저에서 돌아가는 "웹 워썬더"** — 실시간 항공 전투 게임을 만드는 것이 최종 목표다.

| 축 | 내용 |
|---|---|
| **싱글플레이** | 스테이지 기반 항공전 콘텐츠. 비행 모델 · 무장 · 적 AI · 승패 판정 |
| **스테이지 에디터 툴 내장** | 지형과 오브젝트를 게임 안에서 편집하고 씬으로 저장/로드. **현재 구현의 주력이자 기반** |
| **멀티플레이 (추후)** | 당장 구현하지 않는다. 다만 구조를 결정할 때 나중에 네트워크를 얹을 수 있는 쪽을 택한다 |

설계 판단이 갈릴 때의 우선순위:

> **에디터가 계속 동작할 것** → **싱글플레이 게임 루프로 확장 가능할 것** → **멀티플레이를 나중에 얹을 수 있을 것**

멀티플레이를 "염두에 둔다"는 것의 구체적 의미 — 지금 당장 네트워크 코드를 쓰라는 게 아니라, 아래를 나중에 뒤집지 않아도 되게 만들라는 뜻이다:

- 시뮬레이션과 렌더링의 분리 (고정 틱 업데이트 ↔ 가변 프레임 렌더)
- 게임 상태의 직렬화 가능성 (현재 `ExportComponent`가 그 씨앗)
- 입력 → 상태 전이의 결정론성 (전역 싱글턴 직접 참조와 프레임 의존 로직을 줄이는 방향)

## 현재 상태

씬 에디터가 내장된 3D 비행 시뮬레이터. 지형 편집(하이트맵 브러시), 모델 배치/복제/삭제, SRT 조작, 씬 JSON 저장/로드, 3인칭 비행 조작, IR 미사일 유도가 동작한다.
**미구현**: 게임 루프(스테이지 진행·승패·리스폰), HUD, 적 AI, 데미지 모델, 사운드, 멀티플레이.

- 라이브 데모: https://zzcx88.github.io/Typescript-Three.js-GameFramework/
- 소스 + 툴체인: `JWFramework/` · 배포 산출물: `Publish/` · 문서: `docs/`
- **작업 목록: [ROADMAP.md](docs/ROADMAP.md)**

> 이 코드베이스는 저자가 신입 시절 WebGL/프레임워크 학습용으로 직접 작성한 것이다. 레거시 패턴(전역 싱글턴, `instanceof` 분기, 이름 문자열 매칭, 오타 API)이 다수 남아 있다.
> `namespace` + `outFile` 구조는 **ESM으로 전환 완료**([docs/ESM전환-설계.md](docs/ESM전환-설계.md)). 나머지 개선 항목은 ROADMAP에 있으며, **정리되기 전까지는 기존 관례를 따르는 것**이 원칙이다(§6, §7).

---

## 1. 빌드 · 실행

### 폴더 구조

```
/
├── CLAUDE.md  README.md  .gitignore  .gitattributes
├── .github/workflows/pages.yml   ← Publish/ 를 GitHub Pages 로 배포
├── .vscode/tasks.json            ← 빌드·서브 태스크 (cwd = JWFramework)
├── JWFramework/     ← 소스 + 툴체인. npm 명령은 전부 여기서
│   ├── package.json  tsconfig.json  eslint.config.mjs  .madgerc
│   ├── scripts/     ← check-cycles.mjs, cycles-baseline.json
│   ├── node_modules/
│   ├── types/       ← 서드파티 타입 보강 (§2①)
│   ├── Main.ts  define.ts  enum.ts  Style.css
│   └── Manager/ Component/ Object/ Scene/ GUI/ Picker/ ObjectPool/ Shader/
├── Publish/         ← 배포 산출물 = 로컬 실행 루트 = Pages 소스
│   ├── index.html  JWFramework.mjs  JWFramework.css
│   └── Model/       ← 에셋 (glb/gltf, 하이트맵, 스카이박스, Scene.json)
└── docs/            ← 문서 (ROADMAP.md, 설계문서)
```

### 명령

**`JWFramework/` 안에서** 실행한다. 루트가 아니다.

```
cd JWFramework
npm install          # 최초 1회
npm run build        # typecheck → esbuild 번들 → CSS  ⇒ ../Publish/
npm run serve        # http://localhost:8080  (../Publish/ 를 루트로)
npm start            # build:dev + serve
npm run watch        # esbuild --watch (소스맵 포함)
npm run verify       # typecheck + lint + 순환 구조 검사
```

루트에서 일회성으로 돌려야 하면 `--prefix`를 쓴다. 루트에 `package.json`을 두지 않는다.

```
npm --prefix JWFramework run build
```

VS Code 빌드 태스크(`Ctrl+Shift+B`)는 `cwd`가 `JWFramework`로 잡혀 있어 어디서 눌러도 된다.

| 매크로 | 하는 일 |
|---|---|
| `typecheck` | `tsc --noEmit`. **타입 게이트** — esbuild는 타입을 보지 않는다 |
| `lint` / `lint:fix` | ESLint. `import type` 승격 + §7.1 규칙 강제 |
| `check:cycles` | SCC 기준선 래칫. **악화되면 실패**한다 (§3) |
| `build:js` / `build:css` | esbuild → `../Publish/JWFramework.mjs` · `.css` |

- **소스는 `JWFramework/`, 산출물은 `Publish/`.** 둘을 섞지 않는다.
- `fetch("./Model/Scene.json")`을 쓰므로 `file://`로 열면 씬 로드가 실패한다. 반드시 `npm run serve`.
- 산출물(`Publish/*.mjs`, `*.css`)은 **커밋한다**. 소스를 고쳤으면 다시 빌드해서 함께 커밋.
- **배포는 `.github/workflows/pages.yml`이 한다.** Pages 의 브랜치 배포는 `/` 또는 `/docs` 만 고를 수 있어서
  `Publish/` 를 쓰려면 Actions 배포가 필요하다 (저장소 Settings → Pages → Source = GitHub Actions).
- Visual Studio 프로젝트(`.csproj`/`.sln`)는 파일 열기용으로만 남아 있다. **빌드는 npm이 한다.**

---

## 2. 반드시 먼저 알아야 할 것 (지뢰밭)

### ① 서드파티는 npm으로만 — 벤더 파일을 고치지 않는다

`three`, `dat.gui`, `stats.js` 전부 npm 의존성이다. 버전은 `package.json`이 유일한 출처다.

> **과거에 여기서 크게 데였다.** `three.js`와 `Water.js`를 손으로 고쳐 쓰는 바람에 **r134에 4년간 묶였다.**
> 찾아낸 벤더 패치는 3건이었고, 그중 하나(`Water.js`)는 **커밋 이력이 0건**이라 이력만 봐서는 안 잡혔다.
> 처음부터 고친 상태로 커밋됐기 때문이다 — 순정 npm 패키지와 직접 대조해서야 드러났다.

**벤더를 고치고 싶어지면 둘 중 어느 쪽인지 먼저 가린다.**

| 상황 | 처리 |
|---|---|
| 라이브러리의 **버그를 우회**하려는 것 | 십중팔구 이쪽 코드가 잘못 쓴 것이다. **원인을 소스에서 고친다** (§7.1 fog 유니폼 사례) |
| 라이브러리의 **기본 동작을 바꾸려는 것** | 필요한 기능이다. 지우지 말고 **확장점으로 옮긴다** — 상속·래핑·훅 |
| **타입**이 부족하거나 틀린 것 | `JWFramework/types/*.d.ts`에 보강 선언. `as any` 금지 |

실례:
- 물 반사를 스카이박스로 한정하던 `Water.js` 패치 → `onBeforeRender`를 감싸 씬 인자만 바꾸는 방식으로 이전
  ([Envirument/Water.ts](JWFramework/Object/InGameObject/Envirument/Water.ts) `OverrideReflectionScene()`)
- `@types/three@0.134`의 `SkeletonUtils`가 실제 런타임과 불일치 → [types/three-addons.d.ts](JWFramework/types/three-addons.d.ts)에서 정정

### ② three 버전 올리기

이 프로젝트가 ESM으로 옮겨온 **목적 그 자체**다.

```
npm i three@latest @types/three@latest
npm run build && npm run serve   # → docs/ESM전환-설계.md §5 체크리스트 확인
```

현재 **0.134 고정**. 최신은 0.185+ 라 컬러 관리(r152)·조명 강도(r155)·`TransformControls` 구조(r169)가 깨진다.
업그레이드는 [ROADMAP.md](docs/ROADMAP.md) P1-A의 독립 작업으로 진행한다.

### ③ 프레임 루프의 디버그 잔재

`Component/CollisionComponent.ts` `Update()` 안에서 `OBJ_MISSILE` 타입마다 매 프레임 `console.log`가 돈다. 성능 작업 시 제거 대상.

### ④ 오타가 공개 API에 굳어 있다

이름을 "고치면" 전부 깨진다. 새 코드도 **기존 철자를 따를 것**:

`SetPostion` · `MoveFoward` · `GraphComponent`(파일명은 `GraphicCompnent.ts`) · `SplattingShader`(파일명은 `SplettingShader.ts`) · `planeGeomatry` · `heigtBuffer` / `heigtIndexBuffer` · `sorce` · `CreateRendere` · `BuildMotuinBlurShader` · `rotateSpeedAcceletion` · `endHomingStartLenge` · `modeltList` · `TerrianOptiontList` · `orientedBoundingBoxInlcude` · `loadCompletModel` · `CreateOrtbitControl` · 폴더 `Object/InGameObject/Envirument/`

---

## 3. 모듈 시스템 — ESM

`tsconfig`: `"module": "ESNext"`, `"moduleResolution": "Bundler"`, `"target": "ES2020"`, `"noEmit": true`, `"strict": false`

- **모든 파일이 ESM 모듈이다.** `export class Foo`, `import { Foo } from '...'`.
  `namespace JWFramework`와 `/// <reference>`는 전부 제거됐다.
- **파일 추가 시 등록 작업이 없다.** `import`만 하면 번들에 들어간다. `tsconfig.include`가 `JWFramework/**/*.ts` 전체를 잡고, esbuild가 `Main.ts`부터 그래프를 따라간다.

### import 규약

```ts
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBB } from 'three/examples/jsm/math/OBB.js';
import { Water as ThreeWater } from 'three/examples/jsm/objects/Water.js';  // 프로젝트 Water 와 충돌
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { GUI } from 'dat.gui';
import Stats from 'stats.js';

import { ObjectManager } from '../Manager/ObjectManager';   // 상대경로 직접
import type { GameObject } from '../Object/GameObject';     // 타입 전용은 import type
```

1. **상대경로 직접 import.** 배럴(`index.ts`) 경유 금지 — 순환을 대량 생산한다.
2. **타입 전용은 반드시 `import type`.** 손으로 판단하지 말고 `npm run lint:fix`에 맡긴다.
3. three 애드온은 `three/examples/jsm/*`에서 **개별** import. 전역 `THREE`에 애드온은 없다.

### 순환참조

전역 namespace 시절 감춰져 있던 순환이 ESM에선 드러난다. **`extends`가 순환 경로에 걸리면 모듈 평가 시점에 TDZ로 죽는다** — 빌드는 통과하고 런타임에만 터지므로 주의.

| 순위 | 수단 | 언제 |
|---|---|---|
| 1 | `import type` | 타입 위치에서만 쓰일 때. 런타임 의존이 사라져 순환 자체가 안 생긴다 |
| 2 | `import * as X from './Y'` | 값이지만 순환에 걸릴 때. 프로퍼티 접근이 지연된다 |
| 3 | 구조 변경 | 1·2로 안 되면 설계 문제 (§7.0 3단계로 복귀) |

**측정은 SCC(강결합 요소)로 한다.** 서로가 서로에게 도달 가능한 모듈 집합 — 크기 2 이상이면 그 모듈들은 따로 떼어낼 수 없다.

```
npm run check:cycles              # 요약 + 기준선 대비 판정
npm run check:cycles -- --verbose # 덩어리에 속한 모듈 목록
npm run check:cycles:paths        # madge 원본 경로 나열 (참고용)
```

> "순환 경로 N건"으로 세지 않는다. 덩어리 하나에서 경로는 수십 개가 나오고 간선 하나만 바뀌어도 출렁여서 추세를 못 본다.

**현재 기준선: SCC 1개 / 얽힌 모듈 33개 / 내부 간선 130개** (전체 41개 중).
원인은 매니저 싱글턴 상호 호출이고, 무해함은 검증됐지만(설계문서 §7.2) 갚아야 할 빚이다 → [ROADMAP.md](docs/ROADMAP.md) P1-E · P4-B.

`scripts/cycles-baseline.json`이 **래칫**이다. 악화되면 `npm run verify`가 **실패**한다.
줄였다면 기준선 파일을 갱신해 새 기준으로 삼는다.

---

## 4. 아키텍처

### 4.1 프레임 흐름

```
Publish/index.html → Publish/JWFramework.mjs   (esbuild 번들, 진입점 Main.ts)
Main.ts (모듈 본문)
 └ WorldManager.InitializeWorld()
     CreateRendere()      WebGLRenderer ← <canvas id="c">
     CreateMainCamera()   JWFramework.Camera "MainCamera" → ObjectManager.AddObject
     CreateScene()        SceneManager.BuildScene() → new EditScene()
     CreateDeltaTime()    THREE.Clock
 └ requestAnimationFrame 루프
     WorldManager.Animate()
       ├ ResizeView() → 캔버스 크기 변하면 aspect 갱신
       ├ delta = clock.getDelta()
       ├ MainCamera.Animate()
       └ SceneManager.Animate() → CurrentScene.Animate()
            EditScene.Animate()  (ModelLoadManager.LoadComplete == true 일 때만)
              ├ MakeGizmo()          TransformControls 1회 생성
              ├ MakeSceneCloud()     LowCloud 30개 1회 생성
              ├ ObjectManager.Animate()   ← 아래 4.2
              ├ InputProcess()       키 입력 → 픽 모드/기즈모/터레인 옵션
              └ ReloadProcess()      씬 재로드
     WorldManager.Render()  renderer.render(scene, camera)
```

### 4.2 `ObjectManager.Animate()` — 게임 로직의 심장

```
for TYPE in 0..OBJ_END:
  for OBJ in objectList[TYPE]:
     IsClone 이면 → GameObject.Animate()
     IsDead  이면 → DeleteObject() + 배열 compaction(filter undefined)

CollisionManager.CollideSphereToBox(OBJ_OBJECT3D, 비-dummy TERRAIN)
CollisionManager.CollideSphereToBox(OBJ_MISSILE,  비-dummy TERRAIN)
CollisionManager.CollideRayToTerrain(inSecter == true 인 TERRAIN)
CollisionManager.CollideRayToWater(clone 인 WATER)
각 sector terrain 의 inSectorObject 끼리 CollideSphereToSphere   ← 광역 페이즈 대용
InputManager.UpdateKey()   ← 프레임 끝에서 키 상태 전이(DOWN→PRESS→UP)
```

`InputManager.UpdateKey()`가 **프레임 마지막**에 호출되는 것이 핵심이다. `KEY_DOWN`은 딱 1프레임만 참이며, 그 판정은 이 호출을 기준으로 갱신된다.

### 4.3 오브젝트 모델

`GameObject`가 Three.js `Object3D`를 **소유(래핑)** 한다 — 상속하지 않는다.

```
GameObject
  .gameObjectInstance : THREE.Object3D   ← 실제 씬 노드
  .physicsComponent   : PhysicsComponent   위치/회전/스케일/Up·Right·Look 축
  .graphicComponent   : GraphComponent     씬 add/remove 스위치
  .collisionComponent : CollisionComponent AABB / OBB / Sphere / Raycaster
  .exportComponent    : ExportComponent    JSON 직렬화
  .guiComponent       : GUIComponent       ObjectLabel(빌보드 이름표)
  .isClone .isDead .isPlayer .isRayOn .picked
```

컴포넌트는 생성자에서 `GameObject`를 역참조로 받는다(양방향). `GameObject`는 오버라이드용 빈 훅(`Animate`, `InitializeAfterLoad`, `CollisionActive`, `CollisionDeActive`, `Reset`)을 제공한다.

### 4.4 프로토타입 → 클론 생명주기

```
[프로토타입]  IsClone=false
  ModelLoadManager.LoadScene()
    → define.ts 의 ModelSceneEdit.sceneModelData 목록을 순회
    → GLTF 로드 → model.GameObjectInstance 설정 → InitializeAfterLoad()
    → ObjectManager.AddObject()   (씬에는 추가되지 않음. 복제 원본으로만 보관)

[클론]  IsClone=true
  ObjectManager.MakeClone(proto)
    → instanceof 체인으로 생성할 클래스 판별      ★ 확장 지점
    → Name = proto.Name + "Clone" + objectId++
    → 애니메이션 있으면 SkeletonUtils.clone, 없으면 Object3D.clone()
    → InitializeAfterLoad() → 콜라이더/기즈모/라벨 생성
    → AddObject() → SceneInstance.add()

[삭제]
  gameObject.IsDead = true
    → 다음 ObjectManager.Animate() 에서 DeleteObject()
       geometry/material dispose → 컴포넌트 해제 → 씬에서 remove
```

★ **새 클론 가능 클래스를 추가하면 `ObjectManager.MakeClone()`의 `instanceof` 체인을 반드시 수정해야 한다.** 빠뜨리면 런타임에 `alert("... Instance of class name not found")`가 뜬다. 현재 등록: `EditObject`, `AIM9H`, `AIM9L`, `R60M`, `Cloud`, `Water`.

### 4.5 오브젝트 저장소

```ts
objectList: ObjectSet[][]   // ObjectType enum 인덱스와 1:1인 8개 배열
```

`ObjectType` 순서(`enum.ts`)를 바꾸면 배열 인덱싱이 통째로 깨진다. 타입을 추가할 땐 `OBJ_END` **앞에** 넣고 `objectList` 초기화 배열의 길이도 함께 늘릴 것.

### 4.6 터레인 그리드

- 기본 `20 × 20 = 400` 타일. 타일 크기 `900` 유닛, 세그먼트 `16 × 16`.
- 테두리 타일(`i` 또는 `j`가 0 또는 max)은 **dummy** — 세그먼트 1×1, 콜라이더 없음.
- `terrainIndex` = 생성 순서. 이웃 접합은 `terrainIndex ± 1`(좌우), `± row`, `± col`로 계산한다.
- `SetHeight()`가 타일 경계 정점을 수정하면 인접 타일의 대응 정점도 같이 갱신해 이음매를 맞춘다.
- 정점 높이에 따라 스플래팅 셰이더가 텍스처를 섞는다: `~-2 사막 / -1 공장 / 0 농지 / 1 도시 / 1~ 산`.

### 4.7 단위

`UnitConvertManager` 기준: **게임 유닛 900 = 5760 m** (터레인 타일 1장 = 5.76 km).

```
미터   = 유닛 * 5760 / 900
km/h  = (미터 / deltaTime) * 3.6
```

---

## 5. 폴더 맵

각 폴더의 `CLAUDE.md`에 파일 단위 상세 인덱스가 있다.

| 경로 | 내용 |
|---|---|
| [JWFramework/Main.ts](JWFramework/Main.ts) | 진입점. 초기화 + `requestAnimationFrame` 루프 + Stats 패널 |
| [JWFramework/enum.ts](JWFramework/enum.ts) | `SceneType` `ObjectType` `LightType` `PickMode` `TerrainOption` `CameraMode` `KeyState` |
| [JWFramework/define.ts](JWFramework/define.ts) | `Define`(화면 크기), 씬별 모델 목록(`ModelSceneEdit` / `ModelSceneStage`), 인터페이스 `ModelSet` `ObjectSet` `KeySet` |
| [JWFramework/Manager/](JWFramework/Manager/) | 싱글턴 10종 — 월드/씬/오브젝트/로딩/카메라/충돌/입력/GUI/셰이더/단위 |
| [JWFramework/Component/](JWFramework/Component/) | 물리·그래픽·충돌·GUI·직렬화 컴포넌트 |
| [JWFramework/Object/](JWFramework/Object/) | `GameObject` 계층 전체 (카메라·터레인·항공기·미사일·환경·UI·라이트) |
| [JWFramework/Scene/](JWFramework/Scene/) | `SceneBase` / `EditScene`(주력) / `StageScene`(미완) |
| [JWFramework/GUI/](JWFramework/GUI/) | dat.GUI 패널 — 오브젝트 선택 / SRT / 터레인 옵션 |
| [JWFramework/Picker/Picker.ts](JWFramework/Picker/Picker.ts) | 레이캐스트 피킹 + OrbitControls. `PickMode`별 분기(수정/복제/터레인/더미터레인/삭제) |
| [JWFramework/ObjectPool/ObjectPool.ts](JWFramework/ObjectPool/ObjectPool.ts) | 제네릭 풀. 현재 `MissileFog` 500개에만 사용 |
| [JWFramework/Shader/SplettingShader.ts](JWFramework/Shader/SplettingShader.ts) | 터레인 스플래팅 GLSL(문자열). 정점 Y 높이로 5개 텍스처를 `smoothstep` 블렌딩 |
| [JWFramework/types/](JWFramework/types/) | 서드파티 타입 보강 선언. `as any` 대신 여기에 쓴다 (§2①) |
| [JWFramework/scripts/](JWFramework/scripts/) | `check-cycles.mjs`(SCC 래칫) + `cycles-baseline.json` |
| `Publish/` | **배포 산출물 = 로컬 실행 루트 = Pages 소스.** `npm run build`가 채운다 |
| `Publish/Model/` | 에셋(glb/gltf, 하이트맵, 스카이박스) + `Scene.json`(저장된 씬), `Scene_mobil.json` |
| [docs/](docs/) | 문서 — [ROADMAP.md](docs/ROADMAP.md), 설계문서 |
| `JWFramework/node_modules/` | 서드파티는 전부 npm. **수정 금지** (§2①) |

### 조작 키 (에디터)

| 키 | 동작 |
|---|---|
| `1` `2` `3` `4` `6` | 픽 모드: 선택 / 배치 / 터레인 / 삭제 / 더미터레인 |
| `T` | 브러시 드래그 (터레인·배치 모드에서 누른 채 이동) |
| `O` | 터레인 옵션 순환 (UP → DOWN → BALANCE) |
| `U` | 선택 오브젝트를 지면에 붙임 + 높이 오프셋 순환 |
| `Q` | 기즈모 On/Off |
| `W` `E` `R` | 기즈모 모드: 이동 / 회전 / 스케일 |
| `F` / `R` | 3인칭 카메라 진입 / 해제 |
| `Del` | 씬 전체 삭제 후 `Scene.json` 재로드 |
| `P` | 렌더러 통계 + 총 삼각형 수 콘솔 출력 |
| 기즈모 Off 상태에서 → 방향키 롤/피치, `W`/`S` 스로틀, `Space` 미사일 발사, `P` 자신을 "Target"으로 지정 |

---

## 6. 코드 스타일

기존 코드가 **C# 스타일**을 따른다. 새 코드도 여기에 맞춘다.

### 명명

| 대상 | 규칙 | 예 |
|---|---|---|
| 클래스 / 네임스페이스 | `PascalCase` | `HeightmapTerrain`, `JWFramework` |
| 메서드 (public/private 무관) | `PascalCase` | `InitializeAfterLoad()`, `CreateCollider()` |
| 프로퍼티 접근자 (`get`/`set`) | `PascalCase` | `get IsClone()`, `set Name(v)` |
| 필드 / 지역변수 / 파라미터 | `camelCase` | `physicsComponent`, `heightOffset` |
| enum 타입 | `PascalCase` | `ObjectType` |
| enum 멤버 | `접두사_UPPER_SNAKE` | `OBJ_TERRAIN`, `PICK_CLONE`, `KEY_DOWN` |
| 싱글턴 접근자 | `getInstance()` (유일한 camelCase 메서드) | `WorldManager.getInstance()` |

> 관례: `private xxx` 필드와 `public get Xxx()` 접근자가 짝을 이룬다. 필드 직접 노출은 지양.

### 레이아웃

```ts
import * as THREE from 'three';
import { ObjectManager } from '../Manager/ObjectManager';
import { GameObject } from '../Object/GameObject';
import { ObjectType } from '../enum';
import type { PhysicsComponent } from '../Component/PhysicsComponent';

export class Foo extends GameObject
{
    constructor()
    {
        super();
        this.type = ObjectType.OBJ_OBJECT3D;
        this.physicsComponent = new PhysicsComponent(this);
    }

    public InitializeAfterLoad()
    {
        // ...
    }

    public Animate()
    {
        // ...
    }

    // ── 필드는 클래스 맨 아래 ──
    private speed: number = 0;
    protected target: GameObject;
}
```

- import 블록은 파일 최상단. 순서는 `three` → three 애드온 → 프로젝트 순 (§3).
- **중괄호는 Allman(줄 바꿈)**. 일부 파일에 K&R이 섞여 있지만 Allman이 다수이자 기준이다.
- **필드 선언은 클래스 맨 아래**, 모든 메서드 뒤. 이 규칙은 거의 예외 없이 지켜진다.
- 들여쓰기는 클래스부터 시작한다 (namespace 제거로 한 단계 줄었다).
- 들여쓰기 **스페이스 4칸**. 세미콜론 사용.
- `let` 위주 (`const`는 드물게). 비교는 `==` / `!=` (엄격비교 아님).
- 주석은 **한국어**.
- 캐스팅: 기존 코드에 `(x as HeightmapTerrain)` · `(x as unknown as HeightmapTerrain)`가 많지만 **새 코드에서는 쓰지 않는다**. → §7.1
- 오버라이드에 `override` 키워드를 쓰지 않는다 (`noImplicitOverride` 꺼져 있음).
- 죽은 코드는 삭제 대신 주석 처리로 남기는 경향이 있다. 새로 작성할 땐 지우는 쪽을 권장.

---

## 7. 작업 규약

### 7.0 진행 절차 (모든 작업의 기본 흐름)

```
프롬프트 → 요구사항 확인 → 설계 → 계획(페이즈별) → 테스트 짜기 → 이행 → 보고
```

**이 순서를 건너뛰지 않는다.** 특히 "요구사항 확인 → 설계 → 계획"이 끝나기 전에는 코드를 수정하지 않는다.

| 단계 | 할 일 | 산출물 | 넘어가는 조건 |
|---|---|---|---|
| **1. 프롬프트** | 요청을 원문 그대로 파악. 임의로 축소·확대·변형하지 않는다 | — | 요청 범위가 문장으로 정리됨 |
| **2. 요구사항 확인** | 모호한 지점 식별. **코드로 확인 가능한 것은 직접 조사**하고, 사용자 판단이 갈리는 것만 질문한다 | 확인된 요구사항 목록, 비목표(Non-goals) | 갈림길이 전부 해소됨 |
| **3. 설계** | 무엇을 어떻게 바꿀지. 영향 범위, 대안과 트레이드오프, 위험 요소, 기존 구조와의 충돌 지점 | 설계 문서 (`.md`) | 접근 방식이 하나로 확정됨 |
| **4. 계획 (페이즈별)** | 페이즈로 분할. **각 페이즈는 그 자체로 검증 가능하고 롤백 가능해야 한다** | 페이즈별 작업 목록 | 페이즈 경계와 검증 지점이 명확함 |
| **5. 테스트 짜기** | **이행 전에** 검증 방법을 먼저 정의한다. 자동 테스트가 없는 프로젝트이므로 최소한 수동 검증 체크리스트를 만든다 | 검증 체크리스트 / 테스트 코드 | "무엇이 통과하면 성공인지"가 적혀 있음 |
| **6. 이행** | 계획대로 페이즈 단위 실행. **계획에서 벗어나야 하면 멈추고 보고 후 재계획**<br>여러 파일을 일괄로 바꿔야 하면 **§7.2**(표본 승인) | 코드 변경 | 페이즈별 검증 통과 |
| **7. 보고** | 한 일 / 검증된 것 / 검증 안 된 것 / 남은 것을 구분해 보고. **실패·미완을 숨기지 않는다** | 보고 | — |

> 커밋은 이 흐름에 포함되지 않는다. **사용자가 따로 지시할 때만** 하고, 그때도 §7.3을 따른다.

**보조 규칙**

- **3~5단계 산출물은 `.md`로 남긴다.** 대화에만 있으면 다음 세션에서 사라진다.
  → 큰 작업은 `docs/작업명-설계.md`, 로드맵 수준이면 [ROADMAP.md](docs/ROADMAP.md)에 반영.
- **대규모 변경은 브랜치에서.** `main`에 직접 하지 않는다.
- 페이즈 하나가 끝날 때마다 **빌드 통과 + 브라우저 확인**. 통과 못 하면 다음 페이즈로 넘어가지 않는다.
- 사용자가 "바로 해줘"라고 명시한 소규모·저위험 작업은 2~5단계를 압축할 수 있다. 단 **압축했다는 사실을 보고에 명시**한다.

### 7.1 코드 품질 원칙 — 우회하지 않는다

> 이 코드베이스는 "일단 동작하게" 만든 흔적이 쌓여 지금의 상태가 됐다. **앞으로 추가되는 코드는 단단해야 한다.**

#### 금지

| 금지 | 이유 |
|---|---|
| `as any` · `: any` · 암묵적 any | 타입 검사를 통째로 끄는 행위. 컴파일러가 잡아줄 버그를 런타임으로 미룬다 |
| `as unknown as T` 이중 캐스팅 | "타입이 안 맞는다"는 신호를 강제로 묵살하는 것. **구조가 잘못됐다는 증거지 해결책이 아니다** |
| `@ts-ignore` · `@ts-expect-error` | 에러를 덮는다. 원인을 고쳐야 한다 |
| 원인 모르는 채 `if` 추가해 증상만 없애기 | 버그는 그대로 남고 재현 조건만 좁아진다 |
| 크래시만 막는 방어적 null 체크 | "왜 null인가"가 진짜 문제다. 그걸 고쳐야 한다 |
| **서드파티/벤더 파일 수정으로 우회** | 업그레이드 경로가 막힌다. ↓ 아래 실제 사례 참조 |
| "일단 동작하게" 상태로 커밋 | 시간이 없으면 코드가 아니라 [ROADMAP.md](docs/ROADMAP.md) 항목으로 남긴다 |

#### 이 프로젝트에서 실제로 벌어진 일 (반면교사)

`HeightmapTerrain`이 fog 유니폼을 이중으로 감쌌다:

```ts
fogColor: { type: "c", value: THREE.UniformsLib['fog'].fogColor },
//                            └─ 이것 자체가 이미 { value: Color } 다
```

그래서 렌더러의 `uniforms.fogColor.value.copy(...)`가 `TypeError`를 냈고 — **three.js 본체를 고쳐서 우회했다**(`.copy()` → `=`).

결과: three.js가 "패치된 빌드"가 되어 **버전 업그레이드가 원천 차단**됐다. r134에 4년간 묶였다.
소스 한 줄(`{ value: new THREE.Color() }`)만 고쳤으면 없었을 일이다.

> **증상이 난 곳이 아니라 원인이 있는 곳을 고친다.** 라이브러리가 이상해 보이면 십중팔구 이쪽이 잘못 쓴 것이다.

#### 대신 이렇게

| 상황 | 우회 (금지) | 제대로 |
|---|---|---|
| 타입이 안 맞는다 | `as unknown as T` | 타입 정의를 고친다 — 제네릭 / 유니온 / 공통 인터페이스 추출 |
| 런타임엔 타입을 안다 | `as T` | 타입 가드(`function isTerrain(o): o is HeightmapTerrain`) |
| 라이브러리 타입이 부족하다 | `as any` | `JWFramework/types/*.d.ts`에 보강 선언 |
| 구조상 캐스팅이 불가피해 보인다 | 캐스팅 | **설계 문제다.** §7.0 3단계(설계)로 돌아간다 |
| 원인을 모르겠다 | 추측해서 수정 | **고치지 말고 보고한다.** 재현 → 원인 규명 → 수정 순서 |

#### 적용 범위

- **새로 쓰는 코드: 예외 없이 적용.**
- **기존 코드: 만질 때 같이 고친다**(보이스카우트 규칙). 전면 개조는 [ROADMAP.md](docs/ROADMAP.md) P1-B에서.
- 기존의 `as unknown as HeightmapTerrain` 패턴은 **따라야 할 관례가 아니라 갚아야 할 빚**이다.
- 정말 불가피한 예외는 **이유를 주석으로 남긴다**. 주석 없는 캐스팅은 리뷰에서 반려.

> 목표 상태는 `"strict": true`다. 지금은 꺼져 있어 컴파일러가 안 잡아주므로, **그만큼 사람이 더 엄격해야 한다.**

### 7.2 일괄 변경 — 표본 먼저, 승인 후 적용

**언제**: 스크립트 · 정규식 · `sed -i` · 린터 `--fix` 등으로 **여러 파일을 한 번에** 바꿀 때.
import 추가/변경, 이름 일괄 치환, 네임스페이스 제거, 파일 이동·삭제가 전형이다.

**왜**: Bash로 일괄 변경하면 사용자에게는 **명령어 한 줄만** 보인다. 파일별 diff 승인 패널이 뜨지 않는다.
`node codemod.mjs JWFramework` 한 줄이 47개 파일을 재작성해도 그 한 줄로는 무슨 일이 벌어질지 알 수 없다.
**변경 규모가 클수록 검토 지점이 사라지는 역설**이 생긴다.

**절차**

1. **대상과 성격을 먼저 밝힌다** — "N개 파일, import 문 추가 및 namespace 제거"
2. **표본 2~3개의 before/after를 보여준다**
   - 가장 단순한 것 하나 + **가장 까다로운 것 하나**(예외 케이스가 드러나야 한다)
3. **"이대로 N개 파일에 일괄 적용할까요?"** 물어본다 → 여기서 멈춘다
4. 승인 후 실행
5. 실행 직후 **결과 표본을 다시 보여준다** — 의도대로 됐는지 확인시킨다

**예외**: 사용자가 "바로 해줘"라고 명시한 경우. 단 **생략했다는 사실을 보고에 적는다.**

> 되돌릴 수 있다는 것(`git checkout`)은 승인을 건너뛸 이유가 되지 않는다.
> 되돌리기는 최후 수단이지 검토의 대체재가 아니다.

### 7.3 커밋 — 기능별 분할, 보고 후 승인

**커밋은 사용자가 지시할 때만 한다.** 지시받으면 아래 순서로.

1. **`git diff` / `git status`로 변경 전체를 실제로 확인한다.**
   기억이나 작업 로그가 아니라 **diff를 읽는다.** 의도치 않게 섞인 변경이 여기서 드러난다.
2. **기능 단위로 분류한다.** 한 커밋 = 한 가지 일.
   ```
   예)  빌드·툴체인 설정 추가       (package.json, tsconfig, eslint, .gitignore)
        소스 ESM 전환               (JWFramework/**/*.ts)
        벤더 패치 원인 수정          (fog 유니폼, Box3Helper, Water 반사)
        산출물 경로 재편             (docs/, Lib/·Model/ 정리)
        문서                        (CLAUDE.md, ROADMAP.md, 설계문서)
   ```
3. **분할안과 커밋 메시지를 먼저 보고한다. 커밋하지 않는다.**
   어떤 파일이 어느 커밋에 들어가는지까지 제시한다.
4. **승인이 떨어지면** 그때 분할 커밋을 실행한다.

**커밋 메시지**는 기존 관례를 따른다 — 영문 제목 한 줄 + 본문에 `-` 불릿으로 내역.

**커밋 전 체크리스트**

1. `npm run verify` — typecheck **에러 0**, lint **에러 0**, 순환참조 증가 없음
2. `npm run build && npm run serve` — 브라우저에서 실제 동작 확인
   (자동 검증은 렌더링 결과를 판정하지 못한다. 체크리스트: [docs/ESM전환-설계.md](docs/ESM전환-설계.md) §5)
3. 소스를 고쳤으면 **`Publish/JWFramework.mjs` / `.css` 재빌드분을 같이 커밋** (Pages 배포본)
4. `main`에 직접 커밋하지 않는다 (§7.0)

### 파일을 추가할 때

별도 등록 절차가 없다. `export` 하고 쓰는 쪽에서 `import` 하면 끝.

1. `export class Foo` — 상대경로 import로 참조 (§3)
2. `npm run lint:fix` — `import type` 승격을 맡긴다
3. `npm run check:cycles` — 새 순환이 생겼는지 확인

> `.csproj`의 `<TypeScriptCompile>` 목록은 **더 이상 빌드에 쓰이지 않는다**(빌드는 npm). VS 솔루션 탐색기 표시용이므로 갱신하지 않아도 빌드에 영향은 없다.

### 새 GameObject 타입을 추가할 때

1. `GameObject` 상속, 생성자에서 `this.type` 설정 + 필요한 컴포넌트 생성
2. `InitializeAfterLoad()` 구현 — `IsClone == false`(프로토타입) / `true`(클론) 분기 필수
3. 클론 대상이면 **`ObjectManager.MakeClone()`의 `instanceof` 체인에 추가** (§4.4 ★)
4. 로드가 필요하면 `define.ts`의 `ModelSceneEdit.sceneModelData`에 `{ model, mainUrl, lodUrl }` 등록
5. 새 `ObjectType`이 필요하면 `enum.ts`에 `OBJ_END` 앞에 추가 + `ObjectManager.objectList` 초기화 배열 길이 조정
6. 충돌이 필요하면 `CreateCollider()`에서 콜라이더 생성 + `Animate()`에서 `CollisionComponent.Update()` 호출

### 성능 작업 시 우선 볼 곳

- `ObjectManager.Animate()`의 O(n²) 충돌 루프 (섹터 기반 컬링이 이미 있음 — `inSectorObject`)
- 프레임 루프 안의 `new THREE.Vector3()` / `.clone()` — 다수 존재, 재사용 벡터로 치환 가능
- `HeightmapTerrain.SetHeight()`의 전체 정점 순회 (텍스처 판정 루프)
- `CollisionComponent.Update()`의 디버그 `console.log` (§2③)
- `LowCloud.Animate()` — `InstancedMesh` 200개 인스턴스 행렬을 매 프레임 재계산

### 하지 말 것

**코드**
- `as any` · `: any` · `as unknown as T` · `@ts-ignore` (§7.1)
- 원인 규명 없이 증상만 덮는 수정 (§7.1)
- **`node_modules/` 안의 서드파티 파일 수정** — 우회의 대표 사례이자 이 프로젝트가 r134에 4년 묶인 이유.
  타입이 모자라면 `JWFramework/types/*.d.ts`에 보강 선언을 쓴다 (§2①, §7.1)
- 배럴(`index.ts`) 경유 import — 순환 대량 생산 (§3)
- 새 순환참조 추가 (§3)

**절차**
- 요구사항 확인·설계·계획 없이 코드부터 수정 (§7.0)
- **표본 승인 없이 스크립트·`sed -i`·`--fix`로 여러 파일 일괄 변경** (§7.2)
- **지시 없이 커밋** / 분할안 보고 없이 커밋 (§7.3)
- `main` 브랜치에서 대규모 변경 (§7.0)
- 검증 안 된 변경을 "완료"로 보고 (§7.0)

**이 프로젝트 고유**
- 기존 오타 API 이름 "수정" (§2④)
- `ObjectType` enum 순서 변경 (§4.5)
- `Publish/`에 손으로 파일 두기 — 빌드 산출물 폴더다. 문서는 `docs/`, 소스는 `JWFramework/` (§1)
- 루트에서 `npm run ...` — 명령은 `JWFramework/` 안에서 돈다 (§1)