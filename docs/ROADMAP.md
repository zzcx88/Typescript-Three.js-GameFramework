# ROADMAP

목표는 [CLAUDE.md](../CLAUDE.md) 참조 — **웹 워썬더**(싱글플레이 + 스테이지 에디터 내장, 멀티플레이 추후).

---

# ▶ 현재 진행 중 — Phase 0: ESM 전환

**설계·계획·검증 문서: [docs/ESM전환-설계.md](ESM전환-설계.md)**

`namespace` + `outFile` + 손으로 복사·패치한 `Lib/*.js` 구조를 걷어내고 **ESM + npm** 으로 옮긴다.
목적은 하나 — **`npm i three@latest` 한 줄로 three.js를 갱신할 수 있는 상태**를 만드는 것.

> **아래 P0~P4는 전부 이 전환이 끝난 뒤의 작업이다.** Phase 0 이전에는 착수하지 않는다.
> 지금 구조 위에 쌓으면 전환할 때 전부 다시 손봐야 한다.

---

# ESM 전환 이후 작업

> 이 아래는 코드 전수 분석에서 뽑아낸 **초안**이다. 우선순위와 취사선택은 조정 대상.
> 항목마다 근거 파일을 링크했다. 완료한 것은 `[x]`로 바꾸고, 버릴 것은 지운다.
> 일부 항목은 Phase 0에서 함께 해소된다 — 해당 항목에 표시해 두었다.

## 진행 원칙

1. **에디터를 깨뜨리지 않는다.** 에디터가 콘텐츠 제작 수단이므로 항상 동작해야 한다.
2. **Phase 0(ESM 전환)이 모든 것의 선행 조건.** 그 다음 P0 → P1 순으로 토대를 먼저.
3. **한 번에 하나씩, 빌드 통과 + 브라우저 확인 후 커밋.** ([CLAUDE.md](../CLAUDE.md) §7)
4. 큰 전환(틱 기반 루프)은 **결정을 먼저 내리고** 착수한다. §P4-A가 그 지점.

---

## P0 — 빌드 · 저장소 위생

> **대부분 Phase 0(ESM 전환)에서 함께 해소된다.** 아래는 전환 후 남는 것만.

- [x] ~~`tsconfig.json` `include`에 `"ObjectPool/**/*"` 추가~~ → Phase 0에서 tsconfig 재작성으로 해소
- [x] ~~`.gitignore` 추가 + 빌드 부산물 추적 해제~~ → Phase 0
- [x] ~~`@types/three` 패치를 재현 가능하게~~ → Phase 0. ESM에선 `three/examples/jsm/*`를 직접 import하므로 **패치 자체가 불필요**해진다
- [x] ~~`package.json` 스크립트 정비~~ → Phase 0
- [x] ~~`docs/` 동기화~~ → Phase 0. `docs/`가 빌드 산출물 폴더가 되어 수동 복사가 사라진다

**전환 후에도 남는 것**

- [ ] **`CollisionComponent.Update()`의 디버그 `console.log` 제거**
  [Component/CollisionComponent.ts](../JWFramework/Component/CollisionComponent.ts) — `OBJ_MISSILE`마다 매 프레임 호출된다.

- [ ] **명백한 버그 2건 수정**
  - [Object/Camera/Camera.ts](../JWFramework/Object/Camera/Camera.ts) `get Near()`가 `this.Near`를 반환 → **무한 재귀**. 호출부가 없어 잠복 중.
  - [Component/GUIComponent.ts](../JWFramework/Component/GUIComponent.ts) `GetLabel()`의 else 분기가 생성만 하고 `return` 누락 → 최초 호출이 `undefined`.

- [ ] **CI 붙이기** — `npm run typecheck` + `npm run build` + `npm run check:cycles`를 PR에서 자동 실행

---

## P1 — 레거시 정리 (구조 개선, 동작은 유지)

### P1-A. three.js 최신화 (Phase 0의 2단계)

Phase 0에서 three를 **0.134에 고정한 채** ESM으로만 옮긴다. 그 다음 최신(0.185+)으로 올린다.
→ 상세는 [docs/ESM전환-설계.md](ESM전환-설계.md) Phase 2 참조.

- [x] ~~three 0.134 → 최신 업그레이드 (컬러 관리 r152, 조명 강도 체계 r155, `TransformControls` 구조 변경 r169 등)~~
  → **0.185.1 완료.** 사전 점검과 이행 결과는 [docs/three-최신화-점검.md](three-최신화-점검.md)
- [x] ~~**색 관리 재조정** — 업그레이드의 남은 절반. 경로마다 색 파이프라인이 제각각이었다
  (하늘은 뜨고, 지형은 r134 그대로고, 기체는 어두웠다)~~
  → **완료.** 텍스처 sRGB 태그 + 스플래팅 셰이더 출력 변환으로 파이프라인을 통일하고,
  조명·물빛을 다시 잡았다. **톤매핑은 따져본 뒤 쓰지 않기로 결정**(근거: 설계문서 §9.3).
  → 확정값·판단 근거는 [docs/색관리-재조정-설계.md](색관리-재조정-설계.md) §9
- [x] ~~**색 조정용 임시 GUI 패널** — 색값을 코드에 박고 빌드·리로드를 반복하는 방식은 비용이 너무 크다.
  물빛(`sunColor` / `waterColor`)을 맞추다가 실측했고, 조명 강도·노출도 같은 문제를 겪는다.~~
  dat.GUI 의 `addColor()` 로 런타임 조절 → 확정값만 소스에 반영하는 흐름이 필요하다.
  → **완료.** `GUI/GUIControls/GUI_Color.ts`. **임시 패널이며 제거 예정**이다
  ([docs/UI시스템-설계.md](UI시스템-설계.md) 3단계에서 새 컴포넌트로 재작성).
- [ ] 이후 정기 갱신 루틴 확립 — `npm i three@latest` + 회귀 체크리스트

### P1-B. 타입 안전성

- [ ] **`strict` 단계적 도입** — 현재 `"strict": false`
  한 번에 켜면 에러가 쏟아진다. 순서: `noImplicitThis` → `strictFunctionTypes` → `strictNullChecks` → `noImplicitAny`.
  `strictNullChecks`가 가장 값어치 있다(아래 널 크래시들을 컴파일 타임에 잡음).

- [ ] **알려진 널 크래시 정리**
  - [x] ~~`AIM9H/L`, `R60M`의 `Animate()`가 `targetObject`를 널 체크 없이 읽어 `"Target"` 없이 발사하면 터짐~~ → **완료**.
    베이스 `Missile.Animate()`는 이미 `targetObject` 부재를 정상 상태로 다뤄 직선 비행(`MoveForward(120)`)으로 넘어가는데, 파생 3종이 `super.Animate()` 호출 **전에** 읽어서 그 경로에 닿지 못했다.
  - [GUI/GUIControls/GUI_SRT.ts](../JWFramework/GUI/GUIControls/GUI_SRT.ts) `SetGameObject()`가 `CollisionComponent.OBBInclude`를 널 체크 없이 읽는데, `Picker`는 선택 실패 시 `undefined`를 넘긴다.

- [ ] **`CollisionActive` / `CollisionDeActive` 시그니처 통일**
  베이스가 `value: any = 0`이라 구현마다 인자가 다르다(`GameObject` / `ObjectType` / 없음). 컴파일러가 못 잡는다.
  → 충돌 이벤트 객체 하나로 통일하거나, 목적별로 메서드를 분리.

### P1-C. 확장 지점의 하드코딩 제거

새 오브젝트 타입 하나 추가할 때 **손대야 하는 곳이 5군데**다. 게임 콘텐츠를 늘릴수록 병목이 된다.

- [ ] **`ObjectManager.MakeClone()`의 `instanceof` 체인 → 팩토리 레지스트리**
  [Manager/ObjectManager.ts](../JWFramework/Manager/ObjectManager.ts). 현재 `EditObject → AIM9H → AIM9L → R60M → Cloud → Water` 순 분기. 빠뜨리면 런타임 `alert`.
  → `Map<string, () => GameObject>` 프리팹 레지스트리로 대체. 상속 순서 함정도 같이 사라짐.

- [ ] **`LoadSavedScene()`의 이름 문자열 매칭 → 프리팹 ID 기반**
  [Manager/ModelLoadManager.ts](../JWFramework/Manager/ModelLoadManager.ts). `data.name.includes("MIG_29" | "F-5E" | "Water" | "AIM-9")`로 복원 타입을 판별한다.
  → `ExportComponent`가 `prefabId`를 쓰고, 로더는 레지스트리로 조회. **멀티플레이 상태 직렬화(§P4-C)의 전제이기도 하다.**

- [ ] **`ModelSceneBase.getInstance("ModelSceneEdit")`의 문자열 클래스 조회 제거**
  [define.ts](../JWFramework/define.ts) — `new JWFramework[modelSceneType]`. 씬 추가 시 문자열 분기가 늘어난다.

- [ ] **`GUI_Terrain`의 드롭다운 문자열 ↔ enum 수동 양방향 동기화 정리**
  [GUI/GUIControls/GUI_Terrain.ts](../JWFramework/GUI/GUIControls/GUI_Terrain.ts) — 옵션 하나 추가에 3곳 수정 필요.

### P1-D. 죽은 코드 / 미완 코드 처리

각각 **살릴지 지울지 결정**이 필요하다.

| 대상 | 상태 | 판단 |
|---|---|---|
| [Scene/StageScene.ts](../JWFramework/Scene/StageScene.ts) | 생성되지 않음. `SceneManager`가 `SCENE_EDIT` 하드코딩 | **살린다** → §P3-A |
| [Object/InGameObject/AircraftObject.ts](../JWFramework/Object/InGameObject/AircraftObject.ts) · `F16Object.ts` | 스로틀/애프터버너 골격만 | **살린다** → §P3-B 비행 모델의 기반 |
| [Object/InGameUI/IRCircle.ts](../JWFramework/Object/InGameUI/IRCircle.ts) | 링 메시, 미사용 | **살린다** → §P3-C HUD 조준환 |
| [Object/EditObject/TestCube.ts](../JWFramework/Object/EditObject/TestCube.ts) | 미사용 | 삭제 후보 |
| [Component/Component.ts](../JWFramework/Component/Component.ts) | 빈 제네릭 베이스, 아무도 상속 안 함 | 삭제 또는 실제 베이스로 재설계 |
| 주석 처리된 죽은 코드 다수 | 전 파일 | 정리 (git이 이력을 갖고 있다) |

- [ ] 위 표대로 정리
- [ ] **`SceneManager.BuildScene()`의 `sceneType` 하드코딩 제거 + 씬 전환 구현** ([Manager/SceneManager.ts](../JWFramework/Manager/SceneManager.ts))

### P1-E. 조회 성능 / 자료구조

- [ ] **`ObjectManager.GetObjectFromName()` 전 타입 선형 탐색 → `Map<string, GameObject>` 인덱스**
  [Manager/ObjectManager.ts](../JWFramework/Manager/ObjectManager.ts). 프레임 루프 안에서도 호출된다(`Missile.InitializeAfterLoad`, `EditObject.SeekerProcess`).

- [ ] **`objectList: ObjectSet[][]`의 enum 인덱스 결합 완화**
  `ObjectType` 순서를 바꾸면 조용히 깨진다. 배열 길이(8)도 수동 관리 중.

- [ ] **`ObjectManager.Animate()`의 순회 중 배열 재생성 수정**
  삭제 처리에서 `filter`로 배열을 갈아끼워 인덱스가 밀린다 → 같은 프레임에 일부 오브젝트가 `Animate()`를 건너뛴다.

- [ ] **순환 덩어리(SCC) 분해** — 현재 **SCC 1개 / 얽힌 모듈 33개 / 내부 간선 130개** (전체 41개 모듈 중)

  ```
  npm run check:cycles              # 요약 + 기준선 대비 판정
  npm run check:cycles -- --verbose # 덩어리에 속한 모듈 목록
  ```

  **41개 모듈 중 33개가 하나의 상호재귀 덩어리**다. 서로가 서로에게 도달 가능해서 따로 떼어낼 수 없다.
  ESM이 만든 게 아니라 **원래 있던 결합이 드러난 것**이다(`namespace` + `outFile` 시절엔 전부 한 파일이라 방향 개념이 없었다).
  런타임 무해함은 검증됐지만([docs/ESM전환-설계.md](ESM전환-설계.md) §7.2) 갚아야 할 빚이다.

  원인은 **매니저 싱글턴 상호 호출**이다. `X.getInstance()`를 메서드에서 부르려면 모듈 최상단에 `X`의 값 import가 필요한데,
  매니저 10종이 서로를 부르니 완전 그래프에 가까워지고, `GameObject` 파생들이 매니저를 직접 부르면서 33개까지 번졌다.

  **P4-B(전역 싱글턴 의존 완화)와 같은 뿌리다.** 함께 처리한다.
  목표는 "SCC 0"이 아니라 **경계를 긋는 것** — 게임 로직 덩어리와 렌더/GUI 덩어리가 한 방향으로만 의존하게.
  `scripts/cycles-baseline.json`이 래칫이라 **악화되면 `npm run verify`가 실패**한다. 줄면 기준선을 갱신한다.

---

## P2 — 성능

`docs/`의 커밋 이력(`FPS optimize`, `Raycast optimize test`)을 보면 이미 손대본 영역. 400 타일 + 인스턴스 구름 6000개가 부하의 축이다.

- [ ] **프레임 루프의 임시 벡터 할당 제거**
  `new THREE.Vector3()` / `.clone()`이 `EditObject.Animate`, `Missile.Animate`, `HeightmapTerrain.Animate`, `LowCloud.Animate`, `CollisionManager` 전반에 산재. → 클래스 스코프 재사용 버퍼로 치환.

- [ ] **`LowCloud.Animate()` 인스턴스 행렬 재계산 축소**
  [Object/InGameObject/LowCloud.ts](../JWFramework/Object/InGameObject/LowCloud.ts). 덩이당 200 인스턴스 × 30덩이 = **매 프레임 6000개 빌보드 행렬 재계산**. → 카메라가 유의미하게 움직였을 때만 갱신, 또는 셰이더 빌보딩으로 이전.

- [ ] **`HeightmapTerrain.SetHeight()`의 전 정점 순회 제거**
  [Object/CommonObject/Terrain/HeightmapTerrain.ts](../JWFramework/Object/CommonObject/Terrain/HeightmapTerrain.ts). 텍스처 판정(`useDirtTexture`/`useCityTexture`)이 매 픽마다 289개 정점을 돈다. 브러시 드래그 중 연속 호출됨. → 증분 갱신.

- [ ] **충돌 광역 페이즈 정리**
  현재 섹터(`inSectorObject`) 방식이 있지만 `CollideSphereToBox`가 여전히 `오브젝트 × 터레인` 전수 비교다. → 위치 기반 그리드 조회로 터레인 후보를 O(1)에 좁힌다.

- [ ] **터레인 청크 스트리밍 / LOD**
  400 타일을 전부 생성해두고 거리 4500 초과 시 `visible=false`로만 끈다. 지오메트리는 계속 메모리에 상주. 맵을 키우려면 필수.

- [ ] **모델 LOD 활용 확대 — 에셋은 있는데 안 쓰고 있다**
  `ModelLoadManager`의 `THREE.LOD`(300/600) 경로를 쓰는 건 `mig_29` 하나뿐([define.ts](../JWFramework/define.ts)).
  미등록 LOD 에셋: `mig_29_LOD_2.glb`(2단계 미사용), `Tree/tree_lv1.glb`·`tree_lv2.glb`(`tree_lv3`만 등록).
  `ModelSet`이 `lodUrl` 한 단계만 받는 구조 → 다단계 LOD를 받도록 확장 필요.

---

## P3 — 싱글플레이 게임플레이 (워썬더 방향)

여기부터가 "프레임워크 → 게임" 구간. **P1 정리 후 착수 권장.**

### P3-A. 게임 루프 골격

- [ ] `StageScene` 부활 + `SceneManager` 씬 전환 (§P1-D)
  - **환경(조명·포그·스카이박스)은 `EditScene`과 동일하게 새로 잡는다.** 현재 `StageScene`이
    들고 있는 라이트 2개는 개발 초기 잔재이고, 색 관리 재조정 때 배율만 기계적으로 곱해둔
    (2.5 / 1.167) **검증되지 않은 값**이다. 살릴 때 그대로 쓰지 말 것.
    스카이박스가 없고 포그도 `near 10 / far 1000`이라 에디터와 완전히 다른 환경이다.
- [ ] 스테이지 정의 포맷 — 에디터가 저장한 `Scene.json`에 **스폰 지점 / 목표 / 승패 조건**을 얹는다
- [ ] 게임 상태 머신: 시작 → 진행 → 승/패 → 리트라이
- [ ] 리스폰, 스코어

> 에디터가 이미 씬을 만들고 저장한다. **에디터 산출물이 곧 스테이지가 되도록** 포맷을 설계하는 게 핵심.

### P3-B. 비행 모델

현재는 `MoveForward(throttle)` + 축 회전이 전부다. 워썬더 지향이면 최소한:

- [ ] 양력 / 항력 / 받음각(AoA), 실속
- [ ] 스로틀 → 추력 곡선, 애프터버너 (`AircraftObject`의 `afterBurner` 골격 활용)
- [ ] 고도에 따른 공기밀도, 최대속도 제한
- [ ] 조종면 응답성 (속도 의존)
- [ ] **서비스 실링 — 일정 고도 이상에서 실속으로 강제 하강** (에이스컴뱃 방식)
  공기밀도 감소 → 양력 부족이라는 물리로 자연스럽게 상한이 서는 쪽이 바람직하다. 하드 클램프는 최후 수단.

  > **왜 여기 적어두는가**: 지금도 고도 상한이 존재하지만 **의도된 규칙이 아니라 코드 부산물**이다.
  > 터레인 타일의 충돌 AABB 가 `중심 (x, 2000, z) · 크기 (900, 5000, 900)` 이라 y 범위가 `-500 ~ 4500` 이고,
  > 그 위로 올라간 오브젝트는 어느 타일에도 등록되지 않아 **오브젝트 간 충돌 판정이 조용히 사라진다.**
  > 이 제약은 [터레인·충돌 개선안](터레인-충돌-개선안.md) 5단계(격자 인덱스)에서 없어진다 —
  > XZ 만으로 타일을 정하므로 고도와 무관해지기 때문이다.
  > **고도 상한은 그때부터 온전히 게임 규칙의 몫이 된다.**

### P3-B-1. 무장 — 발사 조건과 미사일 수명

- [ ] **비유도 발사 규칙 정리**
  현재는 `"Target"` 이 씬에 없으면 락온 없이 발사되고(직선 비행), 있으면 AIM-9B 식 고정 시커라 시야 10° 안의 락온을 요구한다.
  → 목표가 있어도 비유도 발사는 가능해야 자연스럽다. 락온 여부를 **발사 가능 조건이 아니라 유도 여부**로 분리할 것.

- [ ] **타겟 없이 발사한 미사일이 영원히 난다** ← 위 변경으로 **실제 플레이에서 도달 가능해졌다**
  감속·사망 판정이 전부 [Missile.Animate()](../JWFramework/Object/InGameObject/Weapons/Missile.ts)의 `if (targetObject != undefined)` 안에 있다.
  타겟이 없으면 `MoveForward(120)`로 직선 비행만 하고, 지형에 맞지 않는 한 소멸하지 않는다 — `MissileFog`도 계속 뿜는다.
  → 자체 수명(비행 시간/거리) 기반 소멸을 유도 여부와 무관하게 둔다.

### P3-C. HUD / UI

> 에디터 UI(dat.GUI 교체)는 **별도 작업**이다 → [docs/UI시스템-설계.md](UI시스템-설계.md).
> HUD 는 인게임용이라 요구가 다르지만, 컴포넌트 계층은 공유할 수 있다.

- [ ] 속도계 · 고도계 · 인공수평의 — 현재 `#speed` DOM 텍스트 하나뿐 ([Object/EditObject/EditObject.ts](../JWFramework/Object/EditObject/EditObject.ts) `SpeedIndicatorProcess`)
- [ ] 조준환 / 리드 인디케이터 (`IRCircle` 활용)
- [ ] 레이더 · 표적 정보 (`ObjectLabel`이 이미 거리 표시를 한다)
- [ ] 무장 상태, 피격 표시

### P3-D. 전투

- [ ] **적 AI** — 추적/회피 기동, 교전 판단. 현재 표적은 `P`키로 지정하는 자동 선회 더미(`EditObject.TargetTest`)
  → 사전 검토 완료: [docs/적기AI-설계.md](적기AI-설계.md).
  행동트리로 가되 **BVR은 페이즈 머신, 트리는 WVR만**. 트리보다 먼저 비행 모델의 에너지(§P3-B)와
  입력 추상화가 있어야 한다 — 착수 순서는 그 문서 §10
- [ ] **데미지 모델** — 피격 판정, 부위 손상, 격추 연출
- [ ] **무장 확장** — 기관포(탄도/히트스캔), 레이더 유도 미사일. IR 미사일(`Missile` 계층)은 이미 비례항법 유도가 있다
- [ ] **미사일 유도 정교화** — 시커 시야각/락온 유지, 플레어 대응

### P3-E. 프레젠테이션 · 입력

- [ ] 사운드 (엔진, 무장, 피격) — **현재 오디오 계층이 전혀 없다**
- [ ] 이펙트 — 폭발(`Model/Explosion/` 에셋만 있고 미사용), 피격, 콘트레일
- [ ] 모션블러 부활 검토 — `ShaderManager`에 체인이 있으나 `mixRatio 0.0`으로 비활성
- [ ] 입력 계층 확장 — 게임패드 / 터치. 현재 `keyCode` 기반 키보드 전용 ([Manager/InputManager.ts](../JWFramework/Manager/InputManager.ts))
- [ ] 모바일 대응 정리 — `TestMobileButtonCreate()`가 임시 버튼을 DOM에 직접 꽂는 상태

---

## P4 — 멀티플레이 대비

**지금 구현하지 않는다.** 다만 P1~P3 진행 시 아래를 뒤집지 않도록 방향만 지킨다.

### P4-A. 【결정 필요】 고정 틱 시뮬레이션

현재는 렌더 프레임마다 `deltaTime`을 직접 곱한다(`PhysicsComponent.MoveForward`, `Rotate` 등). 프레임레이트에 따라 결과가 미세하게 달라져 **결정론이 없다**.

- [ ] 고정 틱(예: 60Hz) 시뮬레이션 + 가변 렌더 보간으로 전환할지 결정
  → 전환한다면 **P3-B(비행 모델) 착수 전**이 적기다. 물리를 두 번 안 짜려면.

### P4-B. 전역 싱글턴 의존 완화

`Manager.getInstance()`를 오브젝트 내부에서 직접 호출하는 패턴이 전면적이다. 서버/클라이언트로 나누거나 여러 시뮬레이션 인스턴스를 돌릴 때 걸림돌이 된다.

- [ ] 최소한 **게임 로직 ↔ 렌더/입력/GUI 경계**를 긋는다. 전면 DI까지 갈 필요는 없다.

### P4-C. 상태 직렬화 계층

`ExportComponent`가 씬 저장용 직렬화를 이미 한다. 이걸 **런타임 스냅샷/델타**로 일반화하면 그대로 네트워크 동기화 기반이 된다.

- [ ] `prefabId` 기반 직렬화로 전환 (§P1-C와 동일 작업 — **여기서 미리 갚아두면 이득**)
- [ ] 오브젝트별 네트워크 관련 상태 식별 (위치/회전/속도/HP)

### P4-D. 조사

- [ ] 권위 서버 vs P2P, 클라이언트 예측 / 서버 재조정 / 지연 보상 방식 조사
- [ ] 전송 계층 선정 (WebSocket / WebRTC DataChannel)

---

## 부록 — 손대면 안 되는 것 (정리 전까지)

[CLAUDE.md](../CLAUDE.md) §2, §7 참조. 요약:

- `npm install` / `npm ci` → `@types/three` 패치 소실 (§P0-③ 완료 전까지)
- ~~오타 API 이름 "수정"~~ → **완료**. 전부 올바른 철자로 교정됐다. 구↔신 이름 대응표는 [CLAUDE.md](../CLAUDE.md) §2④
- `ObjectType` enum 순서 변경
- `Lib/` 아래 서드파티 파일 수정
- `import` / `export` 문 (§P1-A 결정 전까지)
