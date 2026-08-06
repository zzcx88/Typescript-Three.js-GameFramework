# UI 시스템 — 설계

dat.GUI 를 버리고 **UIManager + UI 컴포넌트** 구조로 옮기기 위한 사전 검토.
대화로만 오간 조사와 판단을 남겨둔 것이다.

> **상태: 착수 전.** 코드는 아직 한 줄도 없다. §7.0 의 2~3단계(요구사항 확인 · 설계 방향)에 해당하고,
> 페이즈별 검증 계획(5단계)은 착수 시점에 이 문서를 입력 삼아 새로 쓴다.
>
> 코드에서 직접 확인한 것은 위치를 함께 적었고, 그 외는 판단이다.

- 관련 로드맵: [ROADMAP.md](ROADMAP.md) P1-A(임시 색 패널 제거) · P3-C(HUD/UI)
- 폴더 상세: [JWFramework/GUI/CLAUDE.md](../JWFramework/GUI/CLAUDE.md)

---

## 0. 결론 요약

1. **버튼 · 슬라이더 · 인풋박스 · 셀렉션박스 · 라디오버튼을 뷰에 배치하고 바인딩할 수 있는 구조**를 만든다. `UIManager` 가 `UI 컴포넌트`를 조합하는 형태.
2. **한 번에 갈아엎지 않는다.** 뷰 오른쪽에 패널용 `div` 를 하나 만들고, 지금 dat.GUI 패널의 기능을 **하나씩** 옮긴다. 각 단계마다 dat.GUI 패널이 하나씩 줄어들 뿐 나머지는 그대로 동작한다.
3. **이번 범위는 위젯 계층 교체까지다.** 지금 패널들이 들고 있는 **게임 상태는 옮기지 않는다**(§2.2). 두 가지를 동시에 하면 무엇이 깨졌는지 분리할 수 없다.
4. 바인딩은 **하이브리드** — 프레임당 `Update()` 한 번, 컴포넌트는 `Get/Set` 접근자만 (§2.1).
5. 이행은 **6단계**. 마지막에 dat.GUI 의존성을 제거하고 `EditScene` 레이아웃을 새로 잡는다.

**비목표** — §4.

---

## 1. 현재 dat.GUI 의 실체 (실측)

| 파일 | 줄수 | 위젯 |
|---|---:|---|
| [GUI/GUIControls/GUI_SRT.ts](../JWFramework/GUI/GUIControls/GUI_SRT.ts) | 239 | 숫자입력 12 + 체크박스 1 + 버튼 1 |
| [GUI/GUIControls/GUI_Terrain.ts](../JWFramework/GUI/GUIControls/GUI_Terrain.ts) | 103 | 드롭다운 1 + 숫자입력 1 |
| [GUI/GUIControls/GUI_Select.ts](../JWFramework/GUI/GUIControls/GUI_Select.ts) | 72 | 드롭다운 1 + 버튼 1 |
| [GUI/GUIControls/GUI_Color.ts](../JWFramework/GUI/GUIControls/GUI_Color.ts) | 189 | 드롭다운 1 + 슬라이더 3 + 컬러픽커 2 + 버튼 1 — **임시** |
| [Manager/GUIManager.ts](../JWFramework/Manager/GUIManager.ts) | 45 | 지연 생성 getter 3개 |
| [GUI/GUIControls/GUI_Base.ts](../JWFramework/GUI/GUIControls/GUI_Base.ts) | 8 | 빈 베이스 (마커 역할) |

### 실제로 쓰는 위젯은 4종뿐이다

**버튼 · 숫자입력 · 드롭다운 · 체크박스.**
말씀하신 **슬라이더 · 라디오버튼은 지금 없는 것**이다 — 슬라이더만 임시 색 패널이 `dat.GUI` 의 min/max 인자로 흉내내고 있다.

즉 **기존 기능 이전에 필요한 컴포넌트는 4종**이고, 나머지는 신규 설계다.

### 배치

패널마다 **자기 `dat.GUI` 인스턴스를 따로 만든다** — DOM 이 3개(임시 패널 포함 4개) 뜬다.
배치는 `domElement.id` 를 [Style.css](../JWFramework/Style.css) 가 잡는데,

| id | CSS 규칙 |
|---|---|
| `select-gui-container` | 있음 |
| `terrain-gui-container` | 있음 |
| `color-gui-container` | 있음 (임시) |
| `srt-gui-container` | **없음** — dat.GUI 기본 위치(우상단)로 뜬다 |

게다가 규칙들이 `position: static` 이라 `right: 0` 이 무시되고 흐르는 대로 배치된다.
**지금 패널이 가로로 늘어서 있는 것은 이 때문이다.** 레이아웃은 6단계에서 새로 잡는다.

---

## 2. 설계에서 갈리는 지점

### 2.1 바인딩 모델 ★ 가장 큰 결정

dat.GUI 는 `add(객체, '속성명')` 으로 **객체 참조에 바인딩**하고, `.listen()` 을 붙인 컨트롤러는
**매 프레임 값을 폴링**해 표시를 갱신한다.

폴링이 필요했던 이유가 있다 — **SRT 값은 바깥에서 바뀐다.** 기즈모 드래그, 비행 조작,
지면 스냅이 전부 패널을 거치지 않고 `position`/`rotation` 을 고친다.

| 방식 | 장점 | 단점 |
|---|---|---|
| 폴링 (dat.GUI 방식) | 게임 코드를 안 건드림 | 매 프레임 DOM 비교. 멀티플레이 대비 관점에서 나쁨 |
| 푸시 (변경 시 통지) | 깔끔 · 효율적 | `PhysicsComponent` 등에 통지 지점을 심어야 함 = 범위 확대 |
| **하이브리드 ★ 권고** | 패널이 프레임당 `Update()` 를 한 번 받고, 갱신이 필요한 컴포넌트만 값을 다시 읽는다 | — |

하이브리드를 택하는 이유는 **지금 구조를 유지하면서 나중에 푸시로 갈아탈 수 있기 때문**이다.
폴링 지점이 `Update()` 한 곳으로 모이므로, 훗날 그 호출을 통지로 바꾸면 된다.

> 고정 틱 시뮬레이션([ROADMAP.md](ROADMAP.md) P4-A)으로 가면 렌더 프레임과 시뮬 틱이 갈라진다.
> UI 갱신은 **렌더 쪽**에 붙어야 한다. 하이브리드는 그 분리에도 그대로 맞는다.

### 2.2 패널이 게임 상태를 들고 있다 ★ 이번엔 건드리지 않는다

단순한 뷰 교체가 아니다. 지금 패널은 **상태 저장소**를 겸하고, 게임 코드가 그것을 읽는다.

| 패널이 가진 것 | 읽는 쪽 | 효과 |
|---|---|---|
| `GUI_SRT.DefaultRotate` / `DefaultScale` / `DefaultBounding` / `DefaultEditableBounding` | `EditObject.InitializeAfterLoad()` | **새로 배치되는 오브젝트의 콜라이더 종류가 이 체크박스로 결정된다** |
| `GUI_Select.GetSelectObjectName()` | `Picker` `PICK_CLONE` | 어떤 프로토타입을 복제할지 |
| `GUI_Terrain.GetTerrainOption()` / `GetHeightOffset()` | `Picker.Pick()` (매 픽마다) | 브러시 동작 |
| `GUI_Terrain.ChangeTerrainOption()` / `ChangeHeightOffset()` | `EditScene` 키 입력 (`O` / `U`) | 키로도 같은 상태를 돌린다 |

**새 패널이 같은 getter 를 그대로 노출하고, 상태 이전은 별도 항목으로 남긴다.**
위젯 교체와 상태 소유권 이전을 동시에 하면 회귀가 났을 때 원인을 분리할 수 없다.

### 2.3 리바인딩을 일급 API로

`GUI_SRT.SetGameObject()` 는 폴더를 다시 만들지 않고 **dat.GUI 내부 필드(`__controllers`)를 직접 뒤져**
각 컨트롤러의 `.object` 를 새 대상으로 바꿔치기한다.

이게 SRT 패널의 본질이다 — **"같은 위젯 묶음, 다른 대상"**. 새 구조에서는 내부 필드 조작이 아니라
**정식 API(`Rebind(target)` 같은 것)** 여야 한다.

> 임시 색 패널에는 이 요구가 **없다.** 그래서 색 패널만 보고 컴포넌트 API 를 설계하면
> 마지막 단계에서 갈아엎게 된다 — §3 의 순서가 그것을 피하려는 것이다.

### 2.4 이전 중 같이 볼 알려진 문제

- `GUI_SRT.SetGameObject()` 가 `gameObject.CollisionComponent.OBBInclude` 를 **널 체크 없이** 읽는다. `Picker` 는 선택 실패 시 `SetGameObject(undefined)` 를 호출하므로 이 경로에서 터질 수 있다
- `GUI_Select` 의 오브젝트 목록이 **생성 시점에 한 번만** 채워진다. 게다가 `instanceof EditObject` 필터 + `"Water"` 수동 push 라, 배치 가능한 타입을 늘리면 여기도 고쳐야 한다
- `ModelLoadManager.LoadComplete` **getter 에 부작용**이 있다 — 로드 완료 시 `GUIManager.GUI_Select` 를 건드려 패널을 지연 생성한다. 패널 생성 시점을 옮기면 이 결합을 먼저 풀어야 한다
- `GUI_Terrain` 은 드롭다운 문자열과 `TerrainOption` enum 을 **양방향 수동 동기화**한다. 옵션을 추가하려면 세 곳을 고쳐야 한다 — 새 컴포넌트는 enum 을 직접 다루게 설계한다

---

## 3. 이행 순서

| 단계 | 내용 | 왜 여기인가 |
|---|---|---|
| **1** | UI 컴포넌트 코어 + 오른쪽 패널 컨테이너 `div` | 기반 |
| **2** | **`GUI_Terrain` 이전** (103줄, 최소) | 드롭다운 · 숫자입력만. 코어를 검증하는 **최소 사례** |
| **3** | **임시 색 패널을 새 컴포넌트로 재작성** | 슬라이더 · 컬러픽커 신규 컴포넌트가 여기서 생긴다. 색 재조정이 다시 필요해져도 도구가 살아 있다 |
| **4** | `GUI_Select` 이전 | 드롭다운 + 버튼. 목록 동적 갱신 문제(§2.4)도 여기서 |
| **5** | **`GUI_SRT` 이전** (239줄, 최난도) | 리바인딩 · 폴링. **API 가 여기서 진짜 시험된다** |
| **6** | dat.GUI 의존성 제거 + `EditScene` 레이아웃 재설계 | `package.json` 에서 `dat.gui` 삭제 |

### 순서의 근거

- **색 패널을 1번에 두지 않는다.** 리바인딩도 폴링도 없어서, 그것만 보고 API 를 만들면 5단계에서 갈아엎게 된다(§2.3).
- **색 패널을 6번까지 미루지도 않는다.** 지금 임시 패널은 dat.GUI 로 만들어 둔 상태라, 새 구조가 슬라이더 · 컬러픽커를 갖기 전에는 걷어낼 수 없다.
- **`GUI_Terrain` 이 첫 이전 대상**인 이유는 가장 작고, 그러면서도 드롭다운(상태 동기화)이라는 실제 요구를 갖고 있어서다.
- **`GUI_SRT` 가 마지막**인 이유는 이 패널만이 리바인딩과 외부 변경 폴링을 동시에 요구하기 때문이다. 앞 단계에서 API 가 다듬어진 뒤 부딪히는 게 낫다.

**어느 단계에서 멈춰도 씬은 살아 있다.** dat.GUI 패널이 하나씩 줄어들 뿐이다.

---

## 4. 비목표

- **게임 상태 소유권 이전** — 패널이 들고 있는 상태를 게임 쪽으로 옮기는 것(§2.2). 별도 작업
- **HUD** — 인게임 HUD 는 [ROADMAP.md](ROADMAP.md) P3-C. 에디터 UI 와 요구가 다르다
- **범용 UI 프레임워크** — 이 프로젝트가 실제로 쓰는 것만 만든다. 위젯 4종 + 슬라이더 · 라디오
- **모바일 대응** — `EditScene.TestMobileButtonCreate()` 가 `#info` 에 버튼 3개를 심는 실험 코드가 있다. 정리 대상이지만 이번 범위 밖
- **스타일 · 테마 시스템** — 6단계 레이아웃 재설계에서 필요한 만큼만

---

## 5. 미결

| 항목 | 판단 필요 |
|---|---|
| 컴포넌트 구현 방식 | 순수 DOM 조작 vs 템플릿 문자열 vs 경량 라이브러리. **서드파티를 새로 들이는 것은 신중히** — CLAUDE.md §2① |
| `UIManager` 의 위치 | 기존 `GUIManager` 를 개명 · 확장할지, 새로 만들고 `GUIManager` 를 걷어낼지 |
| 패널 등록 방식 | 지연 생성 getter(현행) 유지 vs 명시적 등록 |
| 순환참조 | 새 모듈이 매니저 SCC 에 끌려 들어가지 않게 해야 한다. `GUI_Color` 가 쓴 **구조적 인터페이스** 방식이 참고 사례 — [색관리-재조정-설계.md](색관리-재조정-설계.md) §9.5 |
| 레이아웃 | 6단계에서. 지금은 `position: static` 때문에 가로로 늘어서 있다(§1) |
