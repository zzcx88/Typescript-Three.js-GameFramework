# three.js 최신화 — 사전 점검

> 2026-08-03 조사. 코드 변경 없음. [ROADMAP.md](ROADMAP.md) P1-A / [ESM전환-설계.md](ESM전환-설계.md) Phase 2 의 선행 조사다.

**설치본 `three@0.134.0` / `@types/three@0.134.0` → npm latest `three@0.185.1` / `@types/three@0.185.3`.** 51개 리비전 차이.

---

## 0. 결론 요약

깨지는 방식이 두 종류로 갈리고, **위험한 쪽은 컴파일 에러가 아니다.**

| | 건수 | 성격 |
|---|---:|---|
| A. 컴파일/런타임 즉시 실패 | 3 | 타입체크가 바로 잡아준다. 고치면 끝 |
| B. **조용히 화면만 달라짐** | 2 | 빌드는 통과한다. 눈으로 봐야만 발견된다 ← **주 위험** |
| C. 재검증이 필요한 r134 가정 | 2 | 최신 소스를 읽어 확인해야 한다 |
| D. 이식 잔재 (업그레이드와 무관) | 5 | 지금 정리해두면 업그레이드 판정이 쉬워진다 |

핵심 권고는 §5 — **색 관리와 조명 재조정을 0.134에 머문 채 먼저 끝내서**, 업그레이드 커밋 자체를 "색이 안 변하는" 커밋으로 만드는 것이다.

---

## 1. 이미 해소된 것 (ESM 전환에서 처리됨)

사용자가 우려한 "다른 리비전 코드를 떼다가 강제 이식한 것"은 **파일 단위로는 이미 전부 제거됐다.**

- `Lib/*.js` 벤더 포크 15개 → 삭제. `Publish/index.html` 에 `<script>` 태그 0개, import map 없음. 전부 npm 의존성 번들
- 확인된 벤더 패치 3건의 **원인**이 소스 쪽에서 수정됨 — fog 유니폼 이중 래핑, `Box3Helper.dispose()` 손수 추가, `Water.js` 반사 씬 하드코딩
- 애드온은 전부 정식 경로 import: `OrbitControls` `TransformControls` `GLTFLoader` `OBB` `Water` `SkeletonUtils` `EffectComposer` `RenderPass` `SavePass` `ShaderPass` `CopyShader` `BlendShader`

남은 것은 **파일이 아니라 습관** — 포크된 리비전에 맞춰 튜닝된 설정값과, r134 내부 구현을 전제한 코드다 (§3, §4).

---

## 2. A군 — 컴파일/런타임 즉시 실패

### A-1. `TransformControls` 가 `Object3D` 가 아니게 됨 (r169)

[Scene/EditScene.ts:165](../JWFramework/Scene/EditScene.ts#L165) `SceneInstance.add(this.gizmo)`
[Scene/EditScene.ts:271](../JWFramework/Scene/EditScene.ts#L271) `SceneInstance.remove(this.gizmo)`

→ `add(this.gizmo.getHelper())` / `remove(this.gizmo.getHelper())` 로 바꿔야 한다.
`attach()` `detach()` `setMode()` `.object` `dispose()` `'dragging-changed'` 이벤트는 그대로 쓸 수 있다.

### A-2. `capabilities.isWebGL2` 제거

[Manager/WorldManager.ts:58](../JWFramework/Manager/WorldManager.ts#L58) — `console.log` 한 줄뿐. 삭제하면 된다.

### A-3. 애드온 경로·존속 여부

`three/examples/jsm/**` 경로 자체와 `SavePass` `BlendShader` `CopyShader` 가 0.185 에 남아 있는지는 **설치 후 `npm run typecheck` 가 즉시 판정한다.** 미리 단정하지 않는다.

---

## 3. B군 — 조용히 화면만 달라지는 것 ⚠️

**이 프로젝트는 r134의 "컬러 관리 없음" 기본값에 통째로 의존하고 있다.**

### B-1. 컬러 관리 (r152)

전 소스에서 `outputEncoding` · `sRGBEncoding` · `texture.encoding` · `colorSpace` 사용이 **0건**이다. 즉 모든 텍스처가 기본값으로만 로드된다.

대상 — [Manager/ShaderManager.ts:24-56](../JWFramework/Manager/ShaderManager.ts#L24) 의 8장
(`farm` `mountain` `factory` `city` `desert` `fog` `cloud` `missileFlame`),
[Scene/EditScene.ts:28](../JWFramework/Scene/EditScene.ts#L28) 스카이박스 `CubeTextureLoader` 6면,
[Environment/Water.ts:48](../JWFramework/Object/InGameObject/Environment/Water.ts#L48) 물 노멀맵.

r152+ 에서는 `ColorManagement` 가 기본 활성이고 렌더러 출력이 sRGB 로 바뀐다. 컬러맵에 `SRGBColorSpace` 를 명시하지 않으면 **전체적으로 색이 뜨고 대비가 낮아진다.**

> 노멀맵(`waternormals.jpg`)은 반대로 **sRGB 로 지정하면 안 된다** — 데이터 텍스처다. 일괄 치환하면 물 표면이 깨진다.

### B-2. 커스텀 스플래팅 셰이더의 출력 색공간

[Shader/SplattingShader.ts](../JWFramework/Shader/SplattingShader.ts) 는 `ShaderMaterial` 로 `gl_FragColor` 에 직접 쓴다. 빌트인 머티리얼과 달리 three 가 출력 색공간 변환을 끼워넣지 않으므로, B-1 을 고치면 **터레인만 다른 색으로 남는다.**

- fog 는 `#include <fog_pars_vertex/fog_vertex/fog_pars_fragment/fog_fragment>` 청크만 쓴다. 청크 내부 varying 이름이 `fogDepth → vFogDepth` 로 바뀌었지만 **선언과 사용이 같은 청크 쌍 안에 있어 영향 없다** (수동 varying 선언 없음을 확인)
- `#include <begin_vertex>` → `<project_vertex>` → `<fog_vertex>` 순서도 유효
- 별건: `smoothstep(-2.f, -1.f, ...)` 처럼 **`f` 접미사 float 리터럴**을 쓴다. GLSL ES 1.00 표준이 아니다. 현재는 통과하지만 드라이버 관용에 기대는 상태 — 최신화하는 김에 `-2.0` 으로 바꿔두는 게 안전하다

### B-3. 조명 강도 체계 (r155 기본화, r165 되돌리기 불가)

| 위치 | 값 |
|---|---|
| [EditScene.ts:61](../JWFramework/Scene/EditScene.ts#L61) `DirectionalLight` | 0.6 |
| [EditScene.ts:68](../JWFramework/Scene/EditScene.ts#L68) `AmbientLight` | 0.5 |
| [StageScene.ts:35,40](../JWFramework/Scene/StageScene.ts#L35) | 1.5 / 0.7 |

`useLegacyLights` 가 r165에 **제거**되어 옛 동작으로 되돌릴 수 없다. 값 재조정이 유일한 길이다.

---

## 4. C군 — 재검증이 필요한 r134 가정 · D군 — 이식 잔재

### C-1. `Water.OverrideReflectionScene()` ★

[Environment/Water.ts:67-85](../JWFramework/Object/InGameObject/Environment/Water.ts#L67). 주석이 근거를 명시한다:

> 벤더 `Water.onBeforeRender` 는 `scene` 인자를 **오직 `renderer.render(scene, mirrorCamera)` 한 곳에서만** 쓴다(r134 확인)

이 전제가 0.185 의 `examples/jsm/objects/Water.js` 에서도 참인지 **소스를 직접 읽어 확인해야 한다.** 깨지면 물 반사가 조용히 틀어진다(에러 없이).

### C-2. `SkeletonUtils` 타입 보강

[types/three-addons.d.ts](../JWFramework/types/three-addons.d.ts) — `@types/three@0.134` 의 선언이 실제 런타임과 어긋나서 재선언해둔 것. 파일 자체가 "최신에서 고쳐졌으면 지울 것"이라고 적어두었다. **최신 @types 확인 후 삭제 여부 판단.**

### D. 이식 잔재 (업그레이드 전 정리 권장)

| # | 위치 | 내용 |
|---|---|---|
| D-1 | [Picker.ts:51,53](../JWFramework/Picker/Picker.ts#L51) | `minDistance = -4000` (음수는 무의미), `maxZoom = -4000` (**직교 카메라 전용 속성인데 원근 카메라를 쓴다**). 포크된 리비전에 맞춰 더듬어 맞춘 값으로 보인다 |
| D-2 | 전역 | `OrbitControls.update()` **호출 0건**. 상호작용 시엔 내부에서 자체 호출하므로 지금은 동작한다. 다만 [CameraManager.ts:88-92](../JWFramework/Manager/CameraManager.ts#L88) 가 `object.position` 과 `target` 을 밖에서 직접 바꾸고 `update()` 를 안 부른다 — 리비전 간 동작이 갈리기 쉬운 지점 |
| D-3 | [ShaderManager.ts:111](../JWFramework/Manager/ShaderManager.ts#L111) | `composer.renderToScreen = true` — `EffectComposer` 에 없는 속성이다(`Pass` 의 것). 무해하지만 죽은 코드 |
| D-4 | [ShaderManager.ts:76-111](../JWFramework/Manager/ShaderManager.ts#L76) | 모션블러 체인 전체가 **비활성**(`mixRatio 0.0`, `ShadedRender()` 미호출). 살릴지 지울지 정하지 않으면 최신화 시 검증 대상만 늘어난다 |
| D-5 | [WorldManager.ts:59](../JWFramework/Manager/WorldManager.ts#L59) | `document.body.appendChild(renderer.domElement)` — 캔버스는 이미 `#c` 로 DOM 에 있다. 다시 붙여 위치만 옮기는 셈 |

---

## 4.5 이행 결과 — 0.185.1 업그레이드 (2026-08-03)

사용자 판단으로 **§5 의 P1·P2(색·조명 선행 조정)를 건너뛰고 최신으로 먼저 올린 뒤 재조정**하는 순서를 택했다. 모션블러 컴포저 체인은 이후 SSAO/SMAA 확장을 위해 **유지**.

### 실제 컴파일 에러는 4건

| 위치 | 에러 | 조치 |
|---|---|---|
| [EditScene.ts:165,272](../JWFramework/Scene/EditScene.ts#L165) | `TransformControls` 가 `Object3D` 아님 | `add/remove(gizmo.getHelper())` — **예측 적중** |
| [EditObject.ts:62](../JWFramework/Object/EditObject/EditObject.ts#L62) | `fog` 가 `Material` 기본형에 없음 | `as THREE.LineBasicMaterial` 로 캐스트 — **예측 못 했음** |
| [Picker.ts:122](../JWFramework/Picker/Picker.ts#L122) | `setFromCamera` 가 `{x,y}` 리터럴 거부 | 재사용 `Vector2` 필드 추가 — **예측 못 했음** |

### 예측이 빗나간 것

- **A-2 `capabilities.isWebGL2` — 안 깨진다.** `three.module.js` 에 `isWebGL2: true, // keeping this for backwards compatibility` 로 남아 있다. 설계 문서 Phase 2 표의 해당 행은 틀렸다
- **A-3 애드온 경로 — 전부 유지.** `three/examples/jsm/**` 및 `SavePass` `BlendShader` `CopyShader` 모두 0.185 에 존속

### C군 재검증 완료

- **C-1 `Water.OverrideReflectionScene()` — 전제 유효.** 0.185 의 `examples/jsm/objects/Water.js` 에서 `onBeforeRender(renderer, scene, camera)` 의 `scene` 인자는 `renderer.render(scene, mirrorCamera)` **한 곳에서만** 쓰인다(r134와 동일). 래핑 방식 그대로 유효
- **C-2 `SkeletonUtils` 타입 — 상류에서 수정됨.** `@types/three@0.185.3` 이 `export { clone, retarget, retargetClip }` 로 실제 런타임과 일치한다 → `types/three-addons.d.ts` **삭제**

### 정적 검증 통과

`typecheck` 에러 0 · `lint` 에러 0(기존 `any` 경고 3건 유지) · 순환 기준선 유지 · 번들 1.38MB → 1.75MB.

**남은 것은 B군(색·조명)과 브라우저 회귀 검증.** 이 시점의 화면은 아직 재조정 전이다.

---

## 5. 제안하는 순서

핵심은 **색·조명 회귀를 버전 업그레이드와 분리**하는 것이다.
r134 에도 `outputEncoding` / `sRGBEncoding` 이 있으므로, 최신 기본값과 같은 상태를 **0.134 에 머문 채** 미리 만들 수 있다.

| 페이즈 | 내용 | 버전 | 검증 |
|---|---|---|---|
| **P0** | D군 잔재 정리 (D-1·D-3·D-5, D-2/D-4는 판단 필요) | 0.134 | 기존 동작 유지 |
| **P1** | 컬러 관리를 **명시적으로** 켠다 — `outputEncoding = sRGBEncoding`, 컬러맵 8장 + 스카이박스에 `encoding` 지정(노멀맵 제외), 스플래팅 셰이더 출력 변환 추가 | 0.134 | **여기서 색이 한 번 바뀐다.** 눈으로 확정 |
| **P2** | 조명 강도 재조정 | 0.134 | 밝기 확정 |
| **P3** | `npm i three@latest @types/three@latest` → A군 컴파일 에러 수정 | 0.185 | typecheck 0 |
| **P4** | C군 가정 재확인 (Water 반사, SkeletonUtils 타입) | 0.185 | 물 반사·애니메이션 클론 |
| **P5** | [ESM전환-설계.md §5](ESM전환-설계.md) 체크리스트 완주 | 0.185 | 전체 회귀 |

**P1·P2 를 먼저 끝내두면 P3 의 합격 기준이 "화면이 안 변할 것"으로 단순해진다.** 반대로 P3 을 먼저 하면 색·조명·API 파손이 한꺼번에 섞여 원인 분리가 어렵다.

### 판단이 필요한 것

1. **D-4 모션블러 체인** — 되살릴 것인가, 지울 것인가? 지우면 `EffectComposer`·`SavePass`·`BlendShader`·`CopyShader`·`ShaderPass` 의존이 통째로 사라져 최신화 표면이 크게 줄어든다
2. **중간 리비전을 밟을 것인가** — 파손 원인이 이미 특정돼 있고 각 단계마다 수동 검증 비용이 같으므로, **0.185 로 한 번에 가는 쪽을 권한다**
3. **dat.GUI 교체 작업과의 순서** — UI 를 새로 짤 예정이라면 §5 체크리스트의 GUI 항목이 흔들린다. 어느 쪽을 먼저 할지 정해야 한다
