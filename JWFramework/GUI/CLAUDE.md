# GUI/ — dat.GUI 패널

`GUIControls/` 아래 4개 파일. 전부 `GUIManager.getInstance()`를 통해 **getter 최초 접근 시 지연 생성**되며, 각자 자기 `dat.GUI` 인스턴스를 따로 만든다(패널 3개가 개별 DOM으로 뜬다).

배치는 `Style.css`가 `domElement.id`로 잡는다. 폭은 공통으로 `Canvas.width / 8`.

| id | 코드에서 지정 | `Style.css` 규칙 |
|---|---|---|
| `select-gui-container` | `GUI_Select` | 있음 |
| `terrain-gui-container` | `GUI_Terrain` | 있음 |
| `srt-gui-container` | `GUI_SRT` | **없음** — dat.GUI 기본 위치(우상단)로 뜬다 |

| 파일 | 줄수 | 역할 |
|---|---:|---|
| [GUIControls/GUI_Base.ts](GUIControls/GUI_Base.ts) | 9 | 빈 베이스. `protected CreateFolder(name)` 시그니처만 |
| [GUIControls/GUI_SRT.ts](GUIControls/GUI_SRT.ts) | 232 | 선택 오브젝트의 Position/Rotate/Scale/BoundingBox/IsPlayer |
| [GUIControls/GUI_Select.ts](GUIControls/GUI_Select.ts) | 64 | 배치할 오브젝트 선택 + `Scene.json` Export 버튼 |
| [GUIControls/GUI_Terrain.ts](GUIControls/GUI_Terrain.ts) | 99 | 터레인 브러시 옵션(UP/DOWN/BALANCE) + 높이 오프셋 |

> `GUI_Base.CreateFolder(name: string)`와 파생 클래스의 `CreateFolder()`는 시그니처가 다르다(파라미터 없음). 베이스는 사실상 마커 역할만 한다.

## 공통 패턴

```ts
constructor()
{
    super();
    this.datGui = new dat.GUI();
    this.datGui.domElement.id = '...-gui-container';
    this.datGui.open();
    this.CreateFolder();     // addFolder 로 폴더 생성
    this.AddElement();       // 각 폴더에 컨트롤러 add
    this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
}
```

dat.GUI는 **객체 참조에 바인딩**한다(`folder.add(대상객체, '속성명')`). 그래서 값 갱신이 아니라 `controller.object`를 바꿔치기하는 방식으로 대상을 전환한다 — `GUI_SRT.SetGameObject()` 참조. `.listen()`을 붙인 컨트롤러는 매 프레임 값을 폴링해 표시를 갱신한다.

---

## GUI_SRT.ts

`GUIManager`가 `"MainCamera"` 오브젝트로 초기화한다. 이후 `Picker`가 오브젝트를 선택할 때마다 `SetGameObject(picked)`로 대상이 바뀐다.

**폴더**: `Position` / `Rotate` / `Scale` / `BoundingBox` / `IsPlayer`

`AddElement()`가 대상에 따라 두 갈래로 갈린다:

| 대상 | 바인딩 |
|---|---|
| `Camera` (초기 상태) | 내부 `defaultPosition/Rotate/Scale/Bounding` 벡터에 바인딩 → **새로 배치할 오브젝트의 기본값** 역할 |
| 클론 && Picked | `gameObject.GameObjectInstance.position / rotation / scale`, 콜라이더 `halfSize` 또는 `radius`에 직접 바인딩 |

**`Default*` 접근자** — `EditObject.InitializeAfterLoad()`가 읽는다:

```
DefaultEditableBounding == true  → 클론 생성 시 DefaultRotate/DefaultScale 적용 + DefaultBounding 으로 OBB 생성
                        == false → CreateCollider() 기본 경로 (Sphere r=5)
```

즉 **이 패널의 "Enable Bounding Editable" 체크박스가 이후 배치되는 오브젝트의 콜라이더 종류를 바꾼다.**

`SetGameObject(gameObject)` — 폴더를 재생성하지 않고 각 폴더의 `__controllers`를 순회해 `controller.object`만 새 대상으로 교체한다(dat.GUI 내부 필드 직접 접근).

> ⚠️ `SetGameObject()`가 `gameObject.CollisionComponent.OBBInclude`를 **null 체크 없이** 읽는다. `Picker`는 선택 실패 시 `SetGameObject(undefined)`를 호출하므로 이 경로에서 터질 수 있다.
>
> ⚠️ `isPlayerFunc` / `makeJson`은 dat.GUI에 버튼을 만들기 위해 함수를 생성자처럼 `new`로 감싸는 옛 패턴이다. 그대로 유지할 것.

## GUI_Select.ts

**폴더**: `ObjectList`(드롭다운) / `Output`(Export 버튼)

목록은 `AddElement()` 시점에 `ObjectManager`를 훑어 **`EditObject` 인스턴스인 것만** 이름을 모으고, 끝에 `"Water"`를 수동 추가한다.

```
GetSelectObjectName()  → 현재 선택된 이름. Picker 의 PICK_CLONE 모드가 이걸로 프로토타입을 찾는다
Output → ExportData    → SceneManager.MakeJSON() → Scene.json 다운로드
```

> ⚠️ 목록이 **생성 시점에 한 번만** 채워진다. `ModelLoadManager.LoadComplete` getter가 로드 완료 시 이 패널을 만들도록 유도하는 이유. 배치 가능한 프로토타입 종류를 늘리면 여기 필터(`instanceof EditObject`)와 수동 push 부분을 확인할 것.

## GUI_Terrain.ts

**폴더**: `Terrain` — `TerrainOptionList`(UP/DOWN/BALANCE 드롭다운) + `HeightOffset`(숫자)

```
GetTerrainOption()       현재 TerrainOption enum 값 → Picker 가 SetHeight 에 전달
GetHeightOffset()        브러시 높이 변화량
SetTerrainOptionList()   드롭다운 문자열 → enum 반영    (Picker.Pick() 이 매 픽마다 호출)
ChangeTerrainOption()    enum 순환 후 드롭다운 문자열 갱신 (O 키)
ChangeHeightOffset()     0 → -1 → 1 → 0 순환            (U 키)
```

문자열 드롭다운과 `terrainOption` enum이 **양방향으로 수동 동기화**된다. 옵션을 추가하려면 `AddElement()`의 `item` 배열, `SetTerrainOptionFromEnum()`, `SetTerrainOptionList()` 세 곳을 모두 고쳐야 한다.

---

## 새 패널 추가 절차

1. `GUI_Base` 상속, 생성자에서 위 공통 패턴 그대로 작성
2. `domElement.id` 지정 + `Style.css`에 배치 규칙 추가
3. `Manager/GUIManager.ts`에 `private gui_Xxx` 필드 + 지연 생성 getter 추가
4. 별도 등록 절차 없음 — `GUIManager`에서 import하면 번들에 들어간다