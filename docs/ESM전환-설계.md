# ESM 전환 — 설계 · 계획 · 검증

작성 절차: [CLAUDE.md](../CLAUDE.md) §7.0 (프롬프트 → 요구사항 확인 → **설계 → 계획 → 테스트** → 이행 → 보고)
현 위치: **설계·계획·테스트 정의 단계 완료 → 이행 대기**

작업 브랜치: `esm-migration`

---

## 1. 목적

> **`npm i three@latest` 한 줄로 three.js를 갱신할 수 있는 상태를 만든다.**

이것이 유일한 최종 목적이고, 나머지는 전부 이걸 막고 있는 장애물이다.

### 1.1 지금 왜 못 하는가

| 장애물 | 실태 |
|---|---|
| **three.js 본체가 패치되어 있다** | `Lib/Three/three.js`(r134)에 손댄 곳 2군데. 파일을 갈아끼우면 패치가 날아간다 |
| **타입 정의도 패치되어 있다** | `node_modules/@types/three` 636개 파일을 커밋해두고, 애드온 `.d.ts`를 `src/` 아래로 옮겨 `Three.d.ts`에서 re-export하도록 개조. `npm install` 한 번이면 소멸 |
| **모듈 시스템이 없다** | `"module": "None"` + `outFile`. `import`를 못 쓰니 애드온을 전역 `THREE`에 밀어 넣어야 했고, 그게 위 타입 패치의 원인 |
| **서드파티가 수동 복사본** | `Lib/` 아래 15개 JS를 손으로 받아 넣고 `index.html`에서 `<script>`로 로드. 버전 기록이 없다 |

**벤더 패치 3건 — 성격이 둘로 갈린다**

`three.js` 본체 2건 + `Water.js` 1건. 커밋 이력만으로는 `Water.js`가 안 잡힌다(**처음부터 패치된 상태로 커밋**되어 수정 이력이 0건). 순정 npm 패키지와 직접 대조해서 찾았다.

*(가) 버그 우회 — 원인을 소스에서 고치면 사라진다*

| 패치 | 내용 | 처리 |
|---|---|---|
| `Box3Helper.dispose()` 추가 | r134엔 없던 메서드. `CollisionComponent.DeleteCollider()`가 호출한다 | 호출부에서 `geometry.dispose()` / `material.dispose()`를 직접 부른다. (최신 three엔 내장 → Phase 2에서 되돌려도 됨) |
| `refreshFogUniforms`의 `.copy()` → `=` | **원인은 [HeightmapTerrain.ts](../JWFramework/Object/CommonObject/Terrain/HeightmapTerrain.ts)** — fog 유니폼을 이중으로 감쌌다.<br>`fogColor: { value: THREE.UniformsLib['fog'].fogColor }` ← 우변이 이미 `{ value: Color }` | **소스를 고친다.** `{ value: new THREE.Color() }`. `fogDensity`/`fogFar`/`fogNear`도 동일 |

> 두 번째가 [CLAUDE.md](../CLAUDE.md) §7.1이 금지하는 "벤더 파일 수정 우회"의 전형이다.
> 소스 네 줄 때문에 라이브러리를 고쳤고, 그 대가로 4년간 r134에 묶였다.

*(나) 의도적 기능 — 없애면 안 되고, 벤더 밖으로 옮겨야 한다*

| 패치 | 내용 |
|---|---|
| `Water.js`의 반사 씬 교체 | 물 반사에 **스카이박스만** 비치게 한다. 지형·항공기는 반사되지 않는다 |

```js
// Lib 판 (패치됨)
scope.waterScene = new THREE.Scene();
scope.waterScene.background  = scene.background;
scope.waterScene.environment = scene.background;
scope.waterScene.children = scene.children.filter(o_ => o_ instanceof THREE.Light).slice();
...
renderer.render(scope.waterScene, mirrorCamera);   // 순정: renderer.render(scene, mirrorCamera)
```

**처리** — 벤더 `Water.onBeforeRender`는 `scene` 인자를 **오직 `renderer.render(scene, mirrorCamera)` 한 곳에서만** 쓴다(r134 확인). 따라서 `onBeforeRender`를 감싸 **인자만 반사 전용 씬으로 바꿔 넘기면** 라이브러리를 건드리지 않고 동일한 결과가 나온다.
→ [Envirument/Water.ts](../JWFramework/Object/InGameObject/Envirument/Water.ts) `OverrideReflectionScene()`

> 이 구분이 중요하다. **모든 벤더 패치가 "잘못"은 아니다.** 필요한 기능이었다면 지우는 게 아니라 *옮겨야* 한다.
> 판별 기준: 라이브러리의 버그를 우회하는가(→ 원인을 고친다) / 라이브러리의 기본 동작을 바꾸는가(→ 확장점으로 옮긴다).

**나머지 `Lib/` 13개 파일은 저자 패치 없음**(전수 대조 + 코딩 지문 스캔으로 확인). 순정 대비 줄차이는 ESM→전역 스크립트 변환·three 버전차·리포맷에서 온다.

### 1.2 부수 효과 (목적은 아니지만 따라오는 것)

- 파일 추가 시 `tsconfig.include` + `csproj` 이중 등록이 사라진다
- 의존 관계가 `import`로 명시된다 (지금은 `outFile` 순서에 암묵 의존)
- 소스맵, 트리셰이킹, 정상적인 타입 정의
- `docs/`가 빌드 산출물 폴더가 되어 수동 복사 배포가 사라진다

---

## 2. 비목표 (이번에 하지 않는 것)

명시적으로 **범위 밖**이다. 하나라도 끌어들이면 "동작이 같은지" 판정이 불가능해진다.

- ❌ **three.js 버전 업그레이드** — 0.134에 고정. 업그레이드는 Phase 2
- ❌ **로직 리팩터링** — `namespace` 제거 외의 동작 변경 없음
- ❌ **dat.GUI → lil-gui 교체** — npm의 `dat.gui@0.7.9` 그대로
- ❌ **`strict` 켜기** — `false` 유지
- ❌ **오타 API 이름 수정** — `SetPostion` 등 그대로
- ❌ **성능 개선, 죽은 코드 삭제, 버그 수정** — [ROADMAP.md](ROADMAP.md) P0 이후로
- ❌ **Visual Studio 프로젝트 제거** — `.csproj`/`.sln` 유지 (사용자 결정)

> 예외: **§1.1의 패치 2건 원인 수정**은 목적 달성의 전제이므로 포함한다.

---

## 3. 설계

### 3.1 목표 구조

```
Typescript-Three.js-GameFramework/
├── JWFramework/            ← 소스 + 툴체인
│   ├── package.json  tsconfig.json  eslint.config.mjs  .madgerc  scripts/
│   ├── Main.ts  define.ts  enum.ts  Style.css
│   ├── Manager/ Component/ Object/ Scene/ GUI/ Picker/ ObjectPool/ Shader/
│   ├── types/              ← 필요 시 보강 선언
│   └── JWFramework.csproj  ← 유지 (열기용. TypeScript 빌드는 비활성)
└── Publish/                ← 배포 산출물 = 로컬 실행 루트 (GitHub Pages)
    ├── index.html
    ├── JWFramework.mjs     ← 빌드 산출 (단일 번들)
    ├── JWFramework.css     ← 빌드 산출
    └── Model/              ← 정적 자원 (JWFramework/Model 에서 이동, 중복 해소)
```

`Lib/` 폴더는 **삭제**된다 — 전부 npm으로 대체.

> 위 구조는 ESM 전환 **직후 기준**이다. 이후 폴더 정리로 툴체인이 `JWFramework/` 안으로 들어가고
> 산출물 폴더가 `docs/` → `Publish/` 로 바뀌었다. 현재 구조는 [CLAUDE.md](../CLAUDE.md) §1 참조.

### 3.2 빌드 · 실행 (사내 참고 프로젝트의 빌드 규약을 따름)

참고 프로젝트의 `esbuild 번들 → 배포 폴더 → npx serve <배포 폴더>` 패턴을 그대로 적용.
명령은 `JWFramework/` 안에서 돈다. 최신 목록은 [CLAUDE.md](../CLAUDE.md) §1.

| 매크로 | 명령 |
|---|---|
| `npm run typecheck` | `tsc -p tsconfig.json --noEmit` |
| `npm run build:js` | `esbuild Main.ts --bundle --format=esm --target=es2020 --outfile=../Publish/JWFramework.mjs` |
| `npm run build:css` | `esbuild Style.css --bundle --outfile=../Publish/JWFramework.css` |
| `npm run build` | typecheck → build:js → build:css |
| `npm run watch` | esbuild `--watch --sourcemap` |
| `npm run serve` | `serve ../Publish -l 8080` |
| `npm run start` | build:dev → serve |
| `npm run check:cycles` | 순환 구조(SCC) 검사 + 기준선 래칫 (§3.4) |
| `npm run verify` | typecheck + lint + check:cycles |

> **타입체크와 번들이 분리된다.** esbuild는 타입을 보지 않고 트랜스파일만 하므로(참고 프로젝트도 `transpileOnly: true`),
> `tsc --noEmit`이 타입 게이트 역할을 한다. `npm run build`가 둘을 묶는다.

### 3.3 import 규약

1. **상대경로 직접 import를 기본으로 한다.**
   `import { Foo } from "./Foo"` — 배럴(`index.ts`) 경유 금지. 배럴 경유는 순환을 대량 생산한다.
2. **three 애드온은 `three/examples/jsm/*`에서 직접 가져온다.**
   ```ts
   import * as THREE from 'three';
   import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
   import { OBB } from 'three/examples/jsm/math/OBB.js';
   import { Water as ThreeWater } from 'three/examples/jsm/objects/Water.js';  // 프로젝트 Water 와 충돌 → 별칭
   import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
   ```
3. **이 프로젝트는 라이브러리가 아니라 앱**이므로 자동 생성 배럴(`gen-*-exports.mjs`)은 만들지 않는다.
   진입점은 `Main.ts` 하나다.

### 3.4 순환참조 해결

**현재 실재하는 순환 (전환 전에는 전역 namespace라 드러나지 않던 것)**

```
GameObject → PhysicsComponent → CameraManager → WorldManager → ObjectManager → EditObject
                                                                                    │
                                                        class EditObject extends GameObject
                                                                                    ↓
                                              GameObject 가 아직 초기화 중 → TDZ ReferenceError
```

`extends`는 **모듈 평가 시점에** 부모 바인딩을 요구하므로, 순환 위에 놓이면 런타임에 죽는다.

**해결 순서 (위에서부터 적용)**

| 순위 | 수단 | 적용 대상 | 효과 |
|---|---|---|---|
| 1 | `import type { X }` | 타입 위치에서만 쓰이는 참조 | 런타임 의존이 **아예 사라진다**. 순환 자체가 생기지 않음 |
| 2 | `import * as X from "./Y"` | 값으로 쓰이지만 순환에 걸린 참조 | 프로퍼티 접근이 지연되어 초기화 시점 바인딩 불필요. **참고 프로젝트가 순환 지점에 쓰는 방식** |
| 3 | 구조 변경 | 1·2로 안 되는 경우 | 설계 문제 → §7.0 3단계로 복귀 |

> `GameObject.ts`의 컴포넌트 참조는 전부 **타입 위치**다(필드 선언 + 게터 반환 타입).
> → 1번으로 끊긴다. 이게 최상위 순환의 근원이므로 여기만 해결해도 대부분 풀린다.

**⚠️ 이 코드베이스 고유의 함정 — 게터 이름 = 타입 이름**

```ts
public get CollisionComponent(): CollisionComponent   // 게터 이름과 타입 이름이 같다
```

정규식으로 "값 사용"을 판정하면 `CollisionComponent(`가 호출로 오인되어 **값 import로 잘못 분류된다**.
→ 타입 검사기를 쓴다. `@typescript-eslint`의 `consistent-type-imports` 규칙 `--fix`로 `import type` 승격을 **기계가 아닌 타입 검사기가** 판정하게 한다.

**순환 감지**

참고 프로젝트의 `circular-dependency-plugin`은 webpack 전용이다. esbuild엔 대응 플러그인이 없으므로 `madge`를 쓴다. 역할은 동일 — *제거가 아니라 가시화*.

다만 **세는 단위는 경로가 아니라 SCC(강결합 요소)로 한다.** `madge --circular`의 경로 나열은 덩어리 하나에서도 수십 줄이 나오고 간선 하나에 출렁여서 추세를 못 본다.
→ `scripts/check-cycles.mjs`(madge 그래프 + Tarjan SCC) + `scripts/cycles-baseline.json`(래칫). 악화되면 `npm run verify` 실패. 결과는 §7.2.

### 3.5 개별 처리가 필요한 지점

| 대상 | 문제 | 처리 |
|---|---|---|
| [define.ts](../JWFramework/define.ts) | `new JWFramework[modelSceneType]` — 네임스페이스 객체로 클래스를 문자열 조회. ESM엔 `JWFramework` 객체가 없다 | 명시적 레지스트리 `Record<string, new () => ModelSceneBase>` |
| [Main.ts](../JWFramework/Main.ts) | `namespace` 없이 최상위 블록 `{ ... }` | 모듈 본문으로 전환 + import 추가 |
| [Picker.ts](../JWFramework/Picker/Picker.ts) | `instanceof THREE.Water` | `instanceof ThreeWater` |
| [Envirument/Water.ts](../JWFramework/Object/InGameObject/Envirument/Water.ts) | 클래스명 `Water`가 애드온과 충돌 | 애드온을 `ThreeWater`로 별칭 |
| [ShaderManager.ts](../JWFramework/Manager/ShaderManager.ts) | `THREE.EffectComposer` 등 6종 | postprocessing/shaders 경로에서 개별 import |
| [ObjectManager.ts](../JWFramework/Manager/ObjectManager.ts) | `THREE.SkeletonUtils.clone` | `skeletonClone` |
| [Main.ts](../JWFramework/Main.ts) | 전역 `Stats` | `import Stats from 'stats.js'` |
| GUI 3종 | 전역 `dat.GUI` | `import { GUI } from 'dat.gui'` |
| [CollisionComponent.ts](../JWFramework/Component/CollisionComponent.ts) | `boxHelper.dispose()` — r134 순정엔 없음 | `geometry.dispose()` + `material.dispose()` 직접 호출 |
| [HeightmapTerrain.ts](../JWFramework/Object/CommonObject/Terrain/HeightmapTerrain.ts) | fog 유니폼 이중 래핑 (§1.1) | `{ value: new THREE.Color() }` 등으로 수정 |
| `index.html` | `Lib/*` 15개 `<script>` | 전부 제거, `<script type="module" src="JWFramework.mjs">` 하나로 |
| `Model/` | `JWFramework/Model`과 `docs/Model` 중복 | `docs/Model/` 단일화 |

---

## 4. 계획 (페이즈별)

각 페이즈는 **독립 검증 가능 + 롤백 가능**해야 한다.

### Phase 0-A — 토대 (코드 무수정)
- [x] `esm-migration` 브랜치 생성
- [x] `.gitignore` 추가, `.vs`/`obj`/`bin`/구 산출물 추적 해제
- [x] 루트 `package.json` — three 0.134 고정, dat.gui, stats.js, esbuild, typescript, serve
- [x] `JWFramework/node_modules`(패치된 @types/three) 삭제
- [ ] `tsconfig.json` 재작성 (`module: ESNext`, `moduleResolution`, `--noEmit`)
- [ ] `madge`, `@typescript-eslint` 추가 + `check:cycles` 스크립트
- [ ] `.vscode/tasks.json` 갱신 (빌드 / Serve docs)
- **검증**: `npm run typecheck`가 *구조적으로* 실행됨 (에러는 아직 남아 있어도 됨)

### Phase 0-B — 소스 변환
- [ ] 코드모드: `namespace` 제거 + 디덴트 + `/// <reference>` 제거 + 상대경로 import 생성
- [ ] `eslint --fix`(`consistent-type-imports`)로 `import type` 승격 — §3.4 함정 대응
- [ ] §3.5 개별 처리 12건
- [ ] `npm run check:cycles` → 남은 순환에 namespace import 적용
- **검증**: `npm run typecheck` **에러 0**

### Phase 0-C — 산출물 · 실행 경로
- [ ] `Model/` → `docs/Model/` 단일화, `JWFramework/Model` 삭제
- [ ] `index.html` → `Publish/index.html` 재작성
- [ ] `Lib/` 삭제
- [ ] `csproj`의 TypeScript 빌드 비활성 (파일 목록만 남김)
- **검증**: `npm run build` 성공 → `npm run serve` → **§5 체크리스트 전항 통과**

### Phase 0-D — 정리
- [ ] `CLAUDE.md` §2·§3·§5·§7 갱신 (npm 금지 → npm 필수, import 금지 → import 필수)
- [ ] 폴더별 `CLAUDE.md`의 빌드/구조 서술 갱신
- [ ] 커밋 · `main` 병합
- **검증**: 문서와 실제가 일치

### Phase 2 — three 최신화 (별도 작업)
Phase 0 병합 후 착수. `npm i three@latest @types/three@latest` → 아래 예상 파손 지점 수정.

| 리비전 | 변경 | 영향 |
|---|---|---|
| r152 | `outputEncoding` → `outputColorSpace`, 컬러 관리 기본 활성 | 텍스처 색감 전반 |
| r155 | 물리 기반 조명 강도 기본화 | `DirectionalLight 0.6` / `AmbientLight 0.5` 재조정 필요 |
| r165 | `useLegacyLights` 제거 | 위 항목 되돌리기 불가 |
| r169 | `TransformControls`가 `Object3D`가 아니게 됨 | `scene.add(gizmo)` → `scene.add(gizmo.getHelper())` |
| 전반 | `capabilities.isWebGL2` 제거 | `WorldManager.CreateRendere()`의 로그 |

---

## 5. 테스트 — 수동 검증 체크리스트

자동 테스트가 없는 프로젝트이므로 **이행 전에** 합격 기준을 고정한다.
`npm run build && npm run serve` → `http://localhost:8080` 에서 확인.

### 5.1 기동
- [ ] 콘솔 에러 0건 (특히 `ReferenceError`, `Cannot access before initialization` ← 순환참조 신호)
- [ ] 스카이박스 표시
- [ ] 터레인 20×20 표시, **스플래팅 텍스처가 높이별로 섞임**(사막/공장/농지/도시/산)
- [ ] **포그가 정상 적용됨** ← §1.1 fog 유니폼 수정의 회귀 지점
- [ ] `Scene.json` 로드되어 배치물 복원
- [ ] dat.GUI 패널 3종 표시 (Select / SRT / Terrain)
- [ ] Stats FPS 패널 표시

### 5.2 에디터
- [ ] `1` 선택 모드 — 오브젝트 클릭 시 선택, SRT 패널이 대상 추종
- [ ] `2` 배치 모드 — 드롭다운 선택 후 지형 클릭 시 클론 생성
- [ ] `3` 터레인 모드 + `T` 드래그 — 높이 변형, **타일 경계 이음매 유지**
- [ ] `O` 옵션 순환(UP/DOWN/BALANCE), `U` 높이 오프셋 순환 + 지면 스냅
- [ ] `4` 삭제 모드 — 클릭 시 제거, 콘솔 에러 없음
- [ ] `6` 더미터레인 지정
- [ ] `Q` 기즈모 On/Off, `W`/`E`/`R` 이동·회전·스케일
- [ ] `Del` 씬 전체 삭제 → 재로드
- [ ] Export 버튼 → `Scene.json` 다운로드, **내용이 전환 전과 동일**

### 5.3 인게임
- [ ] 오브젝트 선택 후 `F` 3인칭 진입 / `R` 해제
- [ ] 방향키 롤·피치, `W`/`S` 스로틀, 속도 표시 갱신
- [ ] `P`로 표적 지정 → `Space` 미사일 발사 → **유도 후 궤적 연기(풀링) 정상**
- [ ] 미사일 지면 충돌 시 소멸
- [ ] 오브젝트 라벨 빌보드 표시, 거리 표기
- [ ] 구름(LowCloud) 빌보드가 카메라를 추종

### 5.4 산출물
- [ ] **물 반사에 스카이박스만 비치는가** ← 벤더 패치를 프로젝트 코드로 옮긴 지점(§1.1-나).
      지형이나 항공기가 수면에 비치면 **회귀**다
- [ ] `Publish/JWFramework.mjs` 단일 파일로 생성
- [ ] `Publish/JWFramework.css` 생성
- [ ] `npm run check:cycles` 결과를 기록 (0이 목표, 남으면 목록을 문서화)
- [ ] `Lib/` 및 `JWFramework/Model/` 삭제 확인
- [ ] **`npm i three@0.135.0` → 빌드 통과** ← 목적 달성 증명. 확인 후 0.134로 되돌린다

---

## 6. 위험 요소

| 위험 | 대응 |
|---|---|
| 순환참조 TDZ 크래시 | §3.4. 빌드는 통과하고 **런타임에만** 터지므로 §5.1 기동 확인이 필수 |
| 게터 이름 = 타입 이름 오분류 | 정규식이 아니라 타입 검사기(`consistent-type-imports`)로 판정 |
| GLSL 템플릿 리터럴 디덴트 | `SplettingShader.ts`의 셰이더 문자열. GLSL은 공백에 무의미하나 **§5.1 스플래팅 확인**으로 검증 |
| 순정 r134에 없는 API | `Box3Helper.dispose()` 확인됨. 그 외는 `typecheck`가 잡는다 |
| dat.GUI 내부 필드(`__controllers`) | npm 판도 동일 버전(0.7.9)이므로 유지. `@types/dat.gui`에 선언 있음 |
| `Model/` 이동 중 자산 유실 | 삭제 전에 `docs/Model` 쪽이 상위집합인지 파일 단위 비교 |
| 되돌리기 | 전 과정 `esm-migration` 브랜치. `main`은 무손상 |

---

## 7. 이행 기록

> 페이즈 완료 시마다 결과를 여기에 적는다. 실패·미완도 그대로 적는다.

| 페이즈 | 상태 | 비고 |
|---|---|---|
| 0-A | ✅ 완료 | 브랜치 · `.gitignore` · `package.json` · `tsconfig.json` · `eslint.config.mjs` · `.madgerc` · `.vscode/tasks.json` |
| 0-B | ✅ 완료 | 47파일 변환 → `typecheck` 에러 0, `lint` 에러 0 |
| 0-C | ✅ 완료 | `Lib/`·중복 `Model/` 제거, `docs/` 산출물화, 빌드·서빙 확인 |
| 0-D | ✅ 완료 | 문서 갱신 · **브라우저 실기 확인 통과** · 커밋 |

> **0-B/0-C를 한 번 잘못 "완료" 보고했다.** §3.5의 fog 유니폼 수정을 문서에만 적고 **코드에 적용하지 않은 채** 넘어갔고,
> 자동 검증(typecheck/lint/madge/TDZ 프로브)이 전부 통과해서 그대로 완료로 보고했다.
> 브라우저 첫 실행에서 `uniforms.fogColor.value.copy is not a function` 으로 드러났다.
>
> **교훈**: 설계문서의 개별 처리 목록은 **코드로 전수 대조**해야 한다(기억·작업로그가 아니라 grep으로).
> 그리고 자동 검증 통과는 완료의 근거가 못 된다 — 아래 §7.5 참조.

### 7.1 자동 검증 결과

| 항목 | 결과 |
|---|---|
| `npm run typecheck` | **에러 0** |
| `npm run lint` | **에러 0**, warn 3 (§2 비목표로 남긴 기존 `any`) |
| `npm run build` | 성공 — `JWFramework.mjs` 1.3MB, `JWFramework.css` 802B |
| `npm run verify` | exit 0 |
| 순환 구조 (SCC) | **SCC 1개 · 모듈 33 · 간선 130** — 무해 판정 §7.2 |
| TDZ 크래시 | **없음** — §7.2 |
| three 중복 번들 | 없음 (`REVISION` 선언 1회) |
| 로컬 서빙 | `index.html` / `.mjs` / `.css` / `Model/*` / `waternormals.jpg` 전부 200 |

### 7.2 순환참조 — 구조와 무해 판정 근거

**측정 단위를 경로에서 SCC로 바꿨다.**

madge의 `--circular`은 *순환 경로*를 나열한다. 덩어리 하나에서도 경로는 수십 개가 나오고, 간선 하나만 바뀌어도 숫자가 출렁여 추세를 못 본다. 실제로 이 프로젝트는 경로 55개가 나왔지만 **덩어리는 하나**였다.

```
총 모듈 41개
순환 덩어리(SCC) 1개 · 얽힌 모듈 33개 · 내부 간선 130개
```

**41개 중 33개가 하나의 상호재귀 덩어리다.** 서로가 서로에게 도달 가능해 따로 떼어낼 수 없다.
원인은 매니저 싱글턴 상호 호출 — `X.getInstance()`를 메서드에서 부르려면 모듈 최상단에 `X`의 값 import가 필요하고, 매니저 10종이 서로를 부르니 완전 그래프에 가까워진다.

> **ESM이 만든 게 아니다.** `namespace` + `outFile` 시절엔 전부 한 파일이라 의존 *방향*이라는 개념 자체가 없었을 뿐, 결합은 동일했다. ESM은 드러냈고, 이제 측정 가능해졌다.

`scripts/check-cycles.mjs`(Tarjan SCC)가 이 수치를 내고 `scripts/cycles-baseline.json`을 래칫으로 쓴다 — 악화되면 `npm run verify` 실패. 감축은 [ROADMAP.md](ROADMAP.md) P1-E · P4-B.

**무해 판정** — `import type` 제외 전 96개 경로 → 제외 후 55개 경로(= SCC 1개).

ESM에서 순환 자체는 오류가 아니다. **`extends`가 순환 경로에 걸릴 때만** 모듈 평가 시점에 TDZ로 죽는다.
브라우저 없이 판별하기 위해 최소 DOM 스텁으로 번들을 Node에서 평가했다 — 클래스 정의는 모듈 평가 단계에서 실행되므로 이걸로 충분하다.

```
결과: TDZ 아님 → TypeError: document.head.appendChild is not a function
```

`Cannot access 'X' before initialization` 이 아니라 DOM 스텁 한계에서 멈췄다 = **전 클래스 정의 통과**.
근본 원인이 해소된 덕이다 — `GameObject.ts`가 `import type` 만 갖게 되어(런타임 의존 0) 최상위 순환이 끊겼다.

> **SCC 1개/33모듈**은 남은 빚이지 정상 상태가 아니다. 원인은 매니저 싱글턴 상호참조다.
> 감축은 [ROADMAP.md](ROADMAP.md) P1-C/P4-B. `npm run check:cycles` 로 상시 관측한다.
> 참고 프로젝트(`circular-dependency-plugin`, `failOnError: false`)와 같은 방침 — **막지 않고 보이게 한다**.

### 7.3 설계 시점에 예상 못 했던 것

| 발견 | 처리 |
|---|---|
| `@types/three@0.134` 의 `SkeletonUtils` 선언이 실제 런타임과 불일치. 타입은 `namespace SkeletonUtils`, 런타임은 `clone` named export | `as any` 로 덮지 않고 `JWFramework/types/three-addons.d.ts` 에 올바른 선언 작성 (§7.1 준수) |
| `madge` 가 기본적으로 `import type` 까지 순환으로 계산 (96건으로 부풀려짐) | `.madgerc` 에 `skipTypeImports: true` |
| 구 산출물 `JWFramework.js`(3800줄)가 린트 대상에 포함 | 폐기 대상이므로 삭제 + `**/*.js` ignore |
| `Stats` 는 `@types/stats.js` 가 전역으로도 선언해 **타입체크가 통과해버린다**. 그대로 두면 런타임에만 `undefined` | `Main.ts` 에 `import Stats from 'stats.js'` 명시 |
| `serve` 는 포트 점유 시 임의 포트로 조용히 폴백 | 검증 시 응답 포트를 로그로 확인할 것 |

### 7.4 남은 것

- [x] **브라우저 실기 확인 — §5 체크리스트.** 통과 (fog 유니폼 수정 후)
- [ ] `main` 병합
- [ ] Phase 2 (three 최신화) → [ROADMAP.md](ROADMAP.md) P1-A

### 7.5 자동 검증의 사각지대

이번에 fog 버그를 **어느 자동 검증도 잡지 못했다.** 무엇이 무엇을 보는지 명확히 해 둔다.

| 검증 | 보는 것 | 못 보는 것 |
|---|---|---|
| `tsc --noEmit` | 타입 | `ShaderMaterial` 유니폼은 `{[k:string]: IUniform}` 라 이중 래핑도 통과 |
| `eslint` | 문법·import 형태 | 런타임 값의 형태 |
| `madge` | 모듈 의존 그래프 | 실행 결과 |
| TDZ 프로브 (Node + DOM 스텁) | **모듈 평가 = 클래스 정의** | **렌더 루프에 도달하지 못한다.** 스텁 한계에서 멈춤 |
| 로컬 서빙 (curl) | 파일이 200으로 나오는지 | 그 파일이 브라우저에서 동작하는지 |

**렌더링·게임 로직은 브라우저 실행만이 검증한다.** 자동 검증 통과는 "부술 준비가 됐다"는 뜻이지 "된다"는 뜻이 아니다.
→ [CLAUDE.md](../CLAUDE.md) §7.3 커밋 전 체크리스트 2번이 이것 때문에 있다.
