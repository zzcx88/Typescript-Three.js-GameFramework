# Component/ — GameObject 컴포넌트

`GameObject`가 필드로 소유하고, 컴포넌트는 생성자에서 `GameObject`를 역참조로 받는다(양방향). 컴포넌트 생성은 **각 `GameObject` 파생 클래스의 생성자 책임**이며 필요한 것만 골라 만든다.

```ts
constructor()
{
    super();
    this.type = ObjectType.OBJ_OBJECT3D;
    this.physicsComponent   = new PhysicsComponent(this);   // GameObject.PhysicsCompIncluded = true 자동 설정
    this.graphicComponent   = new GraphComponent(this);     // GameObject.GraphicCompIncluded = true 자동 설정
    this.exportComponent    = new ExportComponent(this);
    this.collisionComponent = new CollisionComponent(this);
    this.guiComponent       = new GUIComponent(this);
}
```

해제는 `GameObject.DeleteAllComponent()`가 일괄 처리한다(`GUIComponent`만 `Dispose()`를 먼저 호출).

| 파일 | 줄수 | 역할 |
|---|---:|---|
| [PhysicsComponent.ts](PhysicsComponent.ts) | 236 | 트랜스폼 + 로컬 축(Up/Right/Look) |
| [CollisionComponent.ts](CollisionComponent.ts) | 237 | AABB / OBB / Sphere / Raycaster |
| [ExportComponent.ts](ExportComponent.ts) | 76 | `Scene.json` 직렬화 |
| [GUIComponent.ts](GUIComponent.ts) | 60 | `ObjectLabel`(빌보드 이름표) 소유 |
| [GraphicCompnent.ts](GraphicCompnent.ts) | 29 | 씬 add/remove 스위치. 클래스명은 `GraphComponent` |
| [Component.ts](Component.ts) | 5 | 빈 제네릭 베이스. **아무도 상속하지 않음** — 사실상 미사용 |

---

## PhysicsComponent.ts

`GameObjectInstance`(= `THREE.Object3D`)의 트랜스폼을 감싸고, 로컬 축 벡터를 캐시한다.

### 설정 (전부 끝에서 `UpdateMatrix()` 호출)

```
SetPostion(x, y, z)          ※ 오타 유지 — Position 아님
SetPostionVec3(vec3)
SetScale(x, y, z) / SetScaleScalar(s)
SetRotate(x, y, z)           오브젝트 축 기준, 델타타임 미적용 (절대 회전용)
SetRotateVec3(vec3)
Rotate(x, y, z)              오브젝트 축 기준, 델타타임 적용
RotateVec3(axis, angle)      월드 축 기준, 델타타임 적용
MoveFoward(distance)         ※ 오타 유지. 로컬 +Z 방향, 델타타임 적용
MoveDirection(dir, distance) 델타타임 적용
```

> **델타타임 적용 여부가 메서드마다 다르다.** `Set*` 계열은 미적용(절대값 세팅), `Rotate`/`Move*` 계열은 적용(프레임 독립 이동). 헷갈리면 여기를 확인할 것.

### 조회

`GetPosition()` `GetScale()` `GetRotateEuler()` `GetRotateMatrix3()` `GetMatrix4()`
`GetMaxVertex()` / `GetMinVertex()` — 전 자식 지오메트리의 **모든 정점을 순회**한다. 매우 비싸므로 프레임 루프에서 쓰지 말 것.

### 로컬 축

`Up` / `Right` / `Look` (get/set). `UpdateMatrix()`가 갱신:

```
Look  = getWorldDirection().normalize()
Up    = matrix.elements[4..6].normalize()
Right = cross(Up, Look).normalize()
```

`UpdateMatrix()`는 `"MainCamera"`가 아니고 카메라 모드가 `CAMERA_3RD`가 아니면 월드 위치를, 그 외엔 로컬 위치를 `vec3Position`에 담는다(다만 `vec3Position`은 외부 노출되지 않는다).

## CollisionComponent.ts

콜라이더 4종을 **선택적으로** 생성한다. 만든 것만 `Update()`에서 갱신된다.

| 생성 | 필드 | Include 플래그 | 헬퍼 |
|---|---|---|---|
| `CreateBoundingBox(x,y,z)` | `THREE.Box3` | `BoundingBoxInclude` | `Box3Helper`(빨강) — 씬에 추가됨 |
| `CreateOrientedBoundingBox(center?, halfSize?)` | `THREE.OBB` | `OBBInclude` | 와이어프레임 `Mesh`, 이름 `<객체명>ObbHelper` — 씬에 추가됨 |
| `CreateBoundingSphere(center?, radius?)` | `THREE.Sphere` | `BoundingSphereInclude` | 헬퍼 코드는 주석 처리 (보이지 않음) |
| `CreateRaycaster()` | `THREE.Raycaster` | — | 항상 아래(0,-1,0) 방향 |

```
Update()   sphere  → 현재 위치로 재설정
           box     → setFromCenterAndSize(위치, sizeAABB)
           obb     → 헬퍼 mesh의 scale/rotation/position 갱신 → matrixWorld 적용 → center 보정
           ray     → 현재 위치에서 아래로 재설정
DeleteCollider()   전부 dispose + null
```

`IsEditable` / `HalfSize` / `Radius` 는 `GUI_SRT` 패널이 직접 바인딩한다(`halfSize`, `radius`는 public 필드로도 노출).

> ⚠️ `Update()` 안에 `if (type == OBJ_MISSILE) console.log(boundingSphere)` 디버그 잔재가 있다. 매 프레임 호출된다.
>
> ⚠️ `ObbBoxHelper`는 `GameObjectInstance`의 자식이 **아니라** 씬 직속이다. 오브젝트 가시성과 별도로 껐다 켜야 한다(`EditObject.LabelOnOff()` 참조).

## ExportComponent.ts

`MakeJsonObject()` — 타입에 따라 두 가지 형태를 낸다.

```
OBJ_TERRAIN : { type, name, isDummy, vertexIndex[], vertexHeight[], scale, rotation, position }
그 외        : { type, name, scale, rotation, position, obbSize }
```

`ObjectManager.MakeJSONArray()`가 이 결과를 모아 `Scene.json`으로 다운로드시킨다. 복원은 `ModelLoadManager.LoadSavedScene()` — **이름 문자열 매칭**이므로 새 타입은 양쪽 다 손봐야 한다.

## GUIComponent.ts

`ObjectLabel`(3D 공간의 빌보드 이름표) 하나를 소유한다. `UpdateDisplay()` / `ShowGUI()`는 비어 있다(미구현).

> ⚠️ `GetLabel()`의 else 분기가 **라벨을 생성만 하고 `return`하지 않는다** → 최초 호출은 `undefined`를 반환한다. `EditObject`가 `InitializeAfterLoad()`에서 한 번 호출해 생성해두기 때문에 실사용에서는 동작하지만, 새 타입에서 `GetLabel().GameObjectInstance` 형태로 바로 쓰면 터진다.

## GraphicCompnent.ts

파일명은 `GraphicCompnent.ts`, **클래스명은 `GraphComponent`** (불일치 유지).

`SetRenderOnOff(bool)` — 씬에서 `GameObjectInstance`를 add/remove 한다. dispose는 하지 않으므로 GPU 리소스는 유지된다.

## Component.ts

`export class Component<T>` — 빈 제네릭 베이스. 현재 어떤 컴포넌트도 상속하지 않는다. 컴포넌트 계층을 정리할 때의 후보 지점.