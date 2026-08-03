# Scene/ — 씬 계층

| 파일 | 줄수 | 상태 |
|---|---:|---|
| [SceneBase.ts](SceneBase.ts) | 56 | 베이스. 생성자 템플릿 메서드 |
| [EditScene.ts](EditScene.ts) | 323 | **현재 유일하게 동작하는 씬** |
| [StageScene.ts](StageScene.ts) | 79 | 미완. `SceneManager`에서 생성되지 않음 |

`SceneManager.BuildScene()`이 `sceneType`을 `SCENE_EDIT`로 하드코딩하고 `EditScene`만 생성한다. 씬 전환은 미구현.

---

## SceneBase.ts

생성자가 **템플릿 메서드 순서를 고정**한다. 파생 클래스는 이 4개를 오버라이드한다(`protected`로 선언되어 있지만 파생 클래스들은 접근 제어자 없이 재정의한다).

```ts
constructor(sceneManager)
{
    this.sceneManager = sceneManager;
    this.BuildSkyBox();   // 배경/환경맵
    this.BuildObject();   // 모델 로드 시작
    this.BuildLight();
    this.BuildFog();
    this.SetPicker();     // new Picker()  ← 오버라이드 대상 아님
}
```

`Animate()`도 오버라이드 대상(베이스는 빈 구현).

**공유 상태**

| 멤버 | 의미 |
|---|---|
| `Picker` | 씬 전역 피커. `Picker`/`CameraManager`/`EditScene`이 `SceneManager.getInstance().CurrentScene.Picker`로 접근 |
| `NeedOnTerrain` | `U` 키를 누르는 동안 true. `CollisionManager`의 레이 스냅을 강제 활성화 |
| `reloadScene` | true면 다음 `Animate()`에서 씬 재구축 |

---

## EditScene.ts

### 구축

```
BuildSkyBox()  CubeTextureLoader('Model/SkyBox/') Right/Left/Up/Down/Front/Back.bmp
               scene.background 와 scene.environment 에 동일 큐브맵 사용
BuildObject()  ModelLoadManager.LoadScene()
               메인 카메라를 Y축 -180° 회전
               ObjectPool<MissileFog> 생성 + MissileFog 500개 사전 적재
BuildLight()   DirectionalLight 0.6 @ (1,1,0) + AmbientLight 0.5, 둘 다 흰색
BuildFog()     THREE.Fog(0xdefdff, near 300, far 2900)
```

### 프레임

```
Animate()   ModelLoadManager.LoadComplete == true 일 때만 전체 실행
  TestMobileButtonCreate()   최초 1회. #info 에 LoadScene / 3rdView / FullScreen 버튼 3개 생성
  MakeGizmo()                gizmo == null 이면 TransformControls 생성
                             'dragging-changed' → OrbitControl.enabled 토글 + EnablePickOff=false
  MakeSceneCloud()           최초 1회. LowCloud 30덩이 랜덤 배치
                             x: -5000~15000, y: 200~400, z: -5000~15000
  ObjectManager.Animate()    ← 게임 로직 본체
  InputProcess()
  ReloadProcess()
```

### InputProcess — 키 → 동작

| 키 | 동작 |
|---|---|
| `1` `2` `3` `4` `6` | `Picker` 모드: MODIFY / CLONE / TERRAIN / REMOVE / DUMMYTERRAIN |
| `T` (PRESS) | CLONE·TERRAIN·DUMMYTERRAIN 모드에서 마우스 위치로 연속 픽 (브러시 드래그) |
| `Q` | `gizmoOnOff` 토글. Off면 현재 선택 대상 detach |
| `W` `E` `R` | `gizmo.setMode("translate" / "rotate" / "scale")` |
| `O` | `GUI_Terrain.ChangeTerrainOption()` (UP→DOWN→BALANCE 순환) |
| `U` (PRESS) | `NeedOnTerrain = true` + `GUI_Terrain.ChangeHeightOffset()` (0→-1→1 순환). 떼면 false |
| `Del` | `DeleteAllObject()` + 기즈모 해제/씬 제거 + `reloadScene = true` |
| `P` | `renderer.info` 콘솔 출력 + 씬 전체 삼각형 수 집계 |

> `W`/`E`/`R`은 기즈모 모드 전환과 `EditObject`의 비행 조작(스로틀/카메라)에 **중복 배정**되어 있다. `EditObject.InputProcess()`가 `GizmoOnOff == false`일 때만 비행 입력을 처리해서 충돌을 피한다.

### ReloadProcess

`reloadScene == true` 이고 터레인 목록이 비었을 때만 실행 — 즉 `DeleteAllObject()`의 지연 삭제가 다 끝난 뒤 한 프레임에 수행된다.

```
LoadHeightmapTerrain() → LoadSavedScene() → renderer.clear()
BuildLight()  ※ 라이트가 매 재로드마다 추가된다 (누적 가능)
gizmo.dispose() → null, madeCloud = false, reloadScene = false
```

### 기즈모

```
MakeGizmo()                최초 1회 생성, 씬에 add
AttachGizmo(gameObject)    gizmoOnOff 일 때만 attach
DetachGizmo(gameObject)    현재 attach된 대상과 같을 때만 detach
GizmoOnOff (get)           EditObject 가 비행 입력 허용 여부 판단에 사용
```

`EditObject.EditHelperProcess()`가 매 프레임 `Picked` 여부로 attach/detach를 호출한다.

---

## StageScene.ts

`SceneBase` 파생이지만 `SceneManager.BuildScene()`의 `SCENE_STAGE` case가 비어 있어 **생성되지 않는다**. `SceneManager.ts`가 `EditScene`만 import한다.

내용: 스카이박스 없음, 라이트 2개(1개만 씬에 추가), 포그 `near 10 / far 1000`, `5`키로 `Scene.json`을 콘솔 출력 + `BuildObject()` 재호출.

인게임 씬을 살릴 때의 시작점. `SceneManager.BuildScene()`의 `switch`와 `sceneType` 하드코딩부터 손봐야 한다.

---

## 새 씬 추가 절차

1. `SceneBase` 상속 → `BuildSkyBox` / `BuildObject` / `BuildLight` / `BuildFog` / `Animate` 오버라이드
2. `enum.ts`의 `SceneType`에 항목 추가
3. `Manager/SceneManager.ts`의 `BuildScene()` `switch`에 case 추가 (+ `sceneType` 하드코딩 제거)
4. 모델 목록이 다르면 `define.ts`에 `ModelSceneBase` 파생 클래스 추가
   → `ModelLoadManager.LoadScene()`이 `ModelSceneBase.getInstance("클래스명")`을 **문자열로** 찾으므로 그 분기도 갱신
5. 별도 등록 절차 없음 — `SceneManager`에서 import하면 번들에 들어간다
