var JWFramework;
(function (JWFramework) {
    class CollisionComponent {
        constructor(gameObject) {
            this.boundingBox = null;
            this.orientedBoundingBox = null;
            this.boundingSphere = null;
            this.raycaster = null;
            this.isEditable = false;
            this.gameObject = gameObject;
            this.boundingBoxInclude = false;
            this.orientedBoundingBoxInlcude = false;
            this.boundingSphereInclude = false;
            this.raycasterInclude = false;
        }
        CreateBoundingBox(x, y, z) {
            this.sizeAABB = new THREE.Vector3(x, y, z);
            this.boundingBox = new THREE.Box3();
            this.boundingBox.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), this.sizeAABB);
            let color = new THREE.Color().setColorName("Red");
            this.boxHelper = new THREE.Box3Helper(this.boundingBox, color);
            if (JWFramework.SceneManager.getInstance().SceneInstance != null)
                JWFramework.SceneManager.getInstance().SceneInstance.add(this.boxHelper);
            this.boundingBoxInclude = true;
        }
        CreateOrientedBoundingBox(center, halfSize) {
            if (center == null)
                center = new THREE.Vector3(0, 0, 0);
            if (halfSize == null)
                halfSize = new THREE.Vector3(1, 1, 1);
            this.halfSize = halfSize;
            this.orientedBoundingBox = new THREE.OBB();
            let color = new THREE.Color().setColorName("Red");
            let obbGeometry = new THREE.BoxGeometry(this.halfSize.x, this.halfSize.y, this.halfSize.z);
            obbGeometry.userData.obb = new THREE.OBB(center, this.halfSize);
            let material = new THREE.MeshBasicMaterial({ color });
            material.wireframe = true;
            this.obbBoxHelper = new THREE.Mesh(obbGeometry, material);
            this.obbBoxHelper.name = this.gameObject.Name + "ObbHelper";
            if (JWFramework.SceneManager.getInstance().SceneInstance != null)
                JWFramework.SceneManager.getInstance().SceneInstance.add(this.obbBoxHelper);
            this.orientedBoundingBoxInlcude = true;
        }
        CreateBoundingSphere() {
        }
        CreateRaycaster() {
            let vec3pos = new THREE.Vector3(0, 0, 0);
            let vecd3 = new THREE.Vector3(0, -1, 0);
            this.raycaster = new THREE.Raycaster(vec3pos, vecd3);
            this.raycasterInclude = true;
        }
        get BoundingBox() {
            return this.boundingBox;
        }
        get BoxHelper() {
            return this.boxHelper;
        }
        get IsEditable() {
            return this.isEditable;
        }
        set IsEditable(value) {
            this.isEditable = value;
        }
        get HalfSize() {
            return this.halfSize;
        }
        set HalfSize(value) {
            this.halfSize = value;
        }
        get OBB() {
            return this.orientedBoundingBox;
        }
        get ObbBoxHelper() {
            return this.obbBoxHelper;
        }
        get BoundingSphere() {
            return this.boundingSphere;
        }
        get Raycaster() {
            return this.raycaster;
        }
        DeleteCollider() {
            if (this.boundingBox) {
                this.boxHelper.visible = false;
                this.boxHelper.geometry.dispose();
                delete this.boundingBox;
                delete this.boxHelper;
                this.boundingBox = null;
                this.boxHelper = null;
            }
            if (this.orientedBoundingBox) {
                this.obbBoxHelper.visible = false;
                delete this.orientedBoundingBox;
                this.obbBoxHelper.geometry.dispose();
                delete this.obbBoxHelper.material;
                delete this.obbBoxHelper.geometry.userData.obb;
                delete this.obbBoxHelper;
                this.orientedBoundingBox = null;
                this.obbBoxHelper = null;
            }
            if (this.raycaster) {
                delete this.raycaster;
                this.raycaster = null;
            }
        }
        Update() {
            if (this.boundingBox) {
                this.boxHelper.box.setFromCenterAndSize(this.gameObject.PhysicsComponent.GetPosition(), this.sizeAABB);
            }
            if (this.orientedBoundingBox) {
                this.obbBoxHelper.scale.set(this.halfSize.x, this.halfSize.y, this.halfSize.z);
                this.obbBoxHelper.rotation.set(this.gameObject.PhysicsComponent.GetRotateEuler().x, this.gameObject.PhysicsComponent.GetRotateEuler().y, this.gameObject.PhysicsComponent.GetRotateEuler().z);
                this.obbBoxHelper.position.set(this.gameObject.PhysicsComponent.GetPosition().x, this.gameObject.PhysicsComponent.GetPosition().y, this.gameObject.PhysicsComponent.GetPosition().z);
                this.orientedBoundingBox.copy(this.obbBoxHelper.geometry.userData.obb);
                this.orientedBoundingBox.applyMatrix4(this.obbBoxHelper.matrixWorld);
                this.orientedBoundingBox.center.set(this.gameObject.PhysicsComponent.GetPosition().x, this.gameObject.PhysicsComponent.GetPosition().y, this.gameObject.PhysicsComponent.GetPosition().z);
            }
            if (this.raycaster) {
                this.raycaster.set(this.gameObject.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
            }
        }
    }
    JWFramework.CollisionComponent = CollisionComponent;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ExportComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
        }
        MakeJsonObject() {
            let obj = new Object();
            if (this.gameObject.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                obj =
                    {
                        type: this.gameObject.Type,
                        name: this.gameObject.Name,
                        isDummy: this.gameObject.IsDummy,
                        vertexIndex: this.gameObject.HeightIndexBuffer,
                        vertexHeight: this.gameObject.HeightBuffer,
                        scale: {
                            x: this.gameObject.PhysicsComponent.GetScale().x,
                            y: this.gameObject.PhysicsComponent.GetScale().y,
                            z: this.gameObject.PhysicsComponent.GetScale().z,
                        },
                        rotation: {
                            x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                            y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                            z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                        },
                        position: {
                            x: this.gameObject.PhysicsComponent.GetPosition().x,
                            y: this.gameObject.PhysicsComponent.GetPosition().y,
                            z: this.gameObject.PhysicsComponent.GetPosition().z
                        }
                    };
            }
            else {
                obj = {
                    type: this.gameObject.Type,
                    name: this.gameObject.Name,
                    scale: {
                        x: this.gameObject.PhysicsComponent.GetScale().x,
                        y: this.gameObject.PhysicsComponent.GetScale().y,
                        z: this.gameObject.PhysicsComponent.GetScale().z
                    },
                    rotation: {
                        x: this.gameObject.PhysicsComponent.GetRotateEuler().x,
                        y: this.gameObject.PhysicsComponent.GetRotateEuler().y,
                        z: this.gameObject.PhysicsComponent.GetRotateEuler().z
                    },
                    position: {
                        x: this.gameObject.PhysicsComponent.GetPosition().x,
                        y: this.gameObject.PhysicsComponent.GetPosition().y,
                        z: this.gameObject.PhysicsComponent.GetPosition().z
                    },
                    obbSize: {
                        x: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.x : 1,
                        y: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.y : 1,
                        z: this.gameObject.CollisionComponent ? this.gameObject.CollisionComponent.HalfSize.z : 1,
                    }
                };
            }
            return obj;
        }
    }
    JWFramework.ExportComponent = ExportComponent;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GraphComponent {
        constructor(gameObject) {
            this.GameObject = gameObject;
            this.GameObject.GraphicCompIncluded = true;
            this.renderSwitch = true;
        }
        SetRenderOnOff(renderSwitch) {
            this.renderSwitch = renderSwitch;
            if (renderSwitch == false) {
                JWFramework.SceneManager.getInstance().SceneInstance.remove(this.GameObject.GameObjectInstance);
            }
            else {
                if (JWFramework.SceneManager.getInstance().SceneInstance)
                    JWFramework.SceneManager.getInstance().SceneInstance.add(this.GameObject.GameObjectInstance);
            }
        }
    }
    JWFramework.GraphComponent = GraphComponent;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GameObject {
        constructor() {
            this.isClone = false;
            this.isDead = false;
            this.isPlayer = false;
            this.isRayOn = false;
            this.physicsCompIncluded = false;
            this.graphicCompIncluded = false;
            this.picked = false;
        }
        InitializeAfterLoad() { }
        get Type() {
            return this.type;
        }
        get Name() {
            return this.name;
        }
        set Name(name) {
            this.name = name;
        }
        get IsClone() {
            return this.isClone;
        }
        set IsClone(isClone) {
            this.isClone = isClone;
        }
        get IsPlayer() {
            return this.isPlayer;
        }
        set IsPlayer(flag) {
            this.isPlayer = flag;
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
        get GraphicComponent() {
            return this.graphicComponent;
        }
        get GUIComponent() {
            return this.guiComponent;
        }
        get ExportComponent() {
            return this.exportComponent;
        }
        get CollisionComponent() {
            return this.collisionComponent;
        }
        get AnimationMixer() {
            return this.animationMixer;
        }
        set AnimationMixer(animationMixer) {
            this.animationMixer = animationMixer;
        }
        get PhysicsCompIncluded() {
            return this.physicsCompIncluded;
        }
        get GraphicCompIncluded() {
            return this.graphicCompIncluded;
        }
        set PhysicsCompIncluded(isIncluded) {
            this.physicsCompIncluded = isIncluded;
        }
        set GraphicCompIncluded(isIncluded) {
            this.graphicCompIncluded = isIncluded;
        }
        set Picked(picked) {
            this.picked = picked;
        }
        get Picked() {
            return this.picked;
        }
        get GameObjectInstance() {
            return this.gameObjectInstance;
        }
        set GameObjectInstance(gameObjectInstance) {
            this.gameObjectInstance = gameObjectInstance;
        }
        get ModelData() {
            return this.modelData;
        }
        set ModelData(anim) {
            this.modelData = anim;
        }
        get IsDead() {
            return this.isDead;
        }
        set IsDead(flag) {
            this.isDead = flag;
        }
        get IsRayOn() {
            return this.isRayOn;
        }
        set IsRayOn(flag) {
            this.isRayOn = flag;
        }
        CollisionActive(value = 0) { }
        CollisionDeActive(value = 0) { }
        Animate() { }
        DeleteObject() {
            this.isDead = true;
        }
        DeleteAllComponent() {
            delete this.physicsComponent;
            this.physicsComponent = null;
            delete this.collisionComponent;
            this.collisionComponent = null;
            delete this.exportComponent;
            this.exportComponent = null;
            delete this.graphicComponent;
            this.graphicComponent = null;
            if (this.guiComponent)
                this.guiComponent.Dispose();
            delete this.guiComponent;
            this.guiComponent = null;
        }
    }
    JWFramework.GameObject = GameObject;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ObjectLabel extends JWFramework.GameObject {
        constructor(name = null) {
            super();
            this.type = JWFramework.ObjectType.OBJ_OBJECT2D;
            if (name != null)
                this.name = name;
            else
                this.name = "ObjectLabel" + JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.CreateBillboardMesh();
        }
        get ReferenceObject() {
            return this.referenceObject;
        }
        set ReferenceObject(object) {
            this.referenceObject = object;
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.GameObjectInstance.name = this.name;
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
        CreateBillboardMesh() {
            let labelTexture = this.MakeCanvasTexture(this.name);
            labelTexture.minFilter = THREE.LinearFilter;
            labelTexture.wrapS = THREE.ClampToEdgeWrapping;
            labelTexture.wrapT = THREE.ClampToEdgeWrapping;
            this.material = new THREE.SpriteMaterial({
                map: labelTexture,
                transparent: true,
                depthWrite: true,
                depthTest: false,
                fog: false,
                sizeAttenuation: false,
            });
            this.mesh = new THREE.Sprite(this.material);
            const labelBaseScale = 0.00065;
            this.mesh.scale.x = this.labelContext.canvas.width * labelBaseScale;
            this.mesh.scale.y = this.labelContext.canvas.height * labelBaseScale;
            this.GameObjectInstance = this.mesh;
            this.InitializeAfterLoad();
        }
        MakeCanvasTexture(name, size = 40) {
            const baseWidth = 150;
            const borderSize = 2;
            if (this.referenceObject == null)
                this.labelContext = document.createElement('canvas').getContext('2d');
            let font = `${size}px bold Verdana`;
            this.labelContext.font = font;
            const textWidth = this.labelContext.measureText(name).width;
            const doubleBorderSize = borderSize * 2;
            const width = baseWidth + doubleBorderSize + 300;
            const height = size + doubleBorderSize + 300;
            this.labelContext.canvas.width = width;
            this.labelContext.canvas.height = height;
            this.labelContext.font = font;
            this.labelContext.textBaseline = 'middle';
            this.labelContext.textAlign = 'center';
            this.labelContext.fillStyle = 'rgba(0,0,0,0)';
            this.labelContext.fillRect(0, 0, width, height);
            const scaleFactor = Math.min(1, baseWidth / textWidth);
            this.labelContext.translate(width / 2, height / 2);
            this.labelContext.scale(scaleFactor, 1);
            this.labelContext.fillStyle = 'red';
            if (this.referenceObject != null) {
                this.labelContext.fillText(this.referenceObject.Name, 0, -50);
            }
            this.labelContext.fillText(name, 0, 50);
            if (this.referenceObject == null)
                return new THREE.CanvasTexture(this.labelContext.canvas);
            else {
                this.material.map.needsUpdate = true;
                return null;
            }
        }
        Animate() {
            if (this.referenceObject != undefined) {
                if (this.referenceObject.Picked == false && this.mesh.visible == true) {
                    this.material.visible = true;
                    let refObjectPosition = this.referenceObject.PhysicsComponent.GetPosition().clone();
                    this.physicsComponent.SetPostion(refObjectPosition.x, refObjectPosition.y, refObjectPosition.z);
                    let pickObject = JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT3D].filter(o => o.GameObject.Picked == true);
                    if (pickObject[0] != undefined) {
                        let length = JWFramework.UnitConvertManager.getInstance().ConvertToDistance(this.referenceObject.PhysicsComponent.GetPosition().clone().sub(pickObject[0].GameObject.PhysicsComponent.GetPosition().clone()).length());
                        length = Math.round(length);
                        if (length > 100000)
                            this.MakeCanvasTexture(length.toString()[0] + length.toString()[1] + length.toString()[2] + " km");
                        else if (length > 10000)
                            this.MakeCanvasTexture(length.toString()[0] + length.toString()[1] + " km");
                        else if (length > 1000)
                            this.MakeCanvasTexture(length.toString()[0] + "." + length.toString()[1] + length.toString()[2] + " km");
                        else
                            this.MakeCanvasTexture(length.toString() + " m");
                    }
                }
                else
                    this.material.visible = false;
            }
        }
    }
    JWFramework.ObjectLabel = ObjectLabel;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUIComponent {
        constructor(gameObject) {
            this.gameObject = gameObject;
        }
        GetLabel() {
            if (this.objectLabel != null)
                return this.objectLabel;
            else {
                this.objectLabel = new JWFramework.ObjectLabel(this.gameObject.Name);
                this.objectLabel.IsClone = true;
                this.objectLabel.ReferenceObject = this.gameObject;
                this.objectLabel.Name = this.gameObject.Name;
            }
        }
        Dispose() {
            this.DisposeLabel();
        }
        DisposeLabel() {
            this.objectLabel.DeleteObject();
            this.objectLabel.ReferenceObject = null;
        }
        UpdateDisplay() {
            if (this.gameObject.PhysicsCompIncluded) {
            }
            if (this.gameObject.GraphicCompIncluded) {
            }
        }
        ShowGUI(show) {
        }
    }
    JWFramework.GUIComponent = GUIComponent;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class CameraManager {
        static getInstance() {
            if (!CameraManager.instance) {
                CameraManager.instance = new CameraManager;
            }
            return CameraManager.instance;
        }
        get MainCamera() {
            return JWFramework.WorldManager.getInstance().MainCamera;
        }
        get CameraMode() {
            return this.cameraMode;
        }
        SetCameraSavedPosition(cameraMode) {
            switch (cameraMode) {
                case JWFramework.CameraMode.CAMERA_3RD:
                    this.ChangeThridPersonCamera();
                    break;
                case JWFramework.CameraMode.CAMERA_ORBIT:
                    this.ChangeOrbitCamera();
                    break;
            }
        }
        ChangeThridPersonCamera() {
            let sceneManager = JWFramework.SceneManager.getInstance();
            this.cameraMode = JWFramework.CameraMode.CAMERA_3RD;
            sceneManager.CurrentScene.Picker.OrbitControl.enabled = false;
            let gameObjectForCamera = sceneManager.CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.add(this.MainCamera.CameraInstance);
            let cameraPosition = gameObjectForCamera.PhysicsComponent.GetPosition();
            this.MainCamera.CameraInstance.lookAt(cameraPosition.x, cameraPosition.y + 1.5, cameraPosition.z);
            this.MainCamera.PhysicsComponent.SetPostion(0, 0, 0);
            let Up = new THREE.Vector3(0, 1, 0);
            let Look = new THREE.Vector3(0, 0, 1);
            this.MainCamera.PhysicsComponent.GetPosition().add(Up.multiplyScalar(0.6));
            this.MainCamera.PhysicsComponent.GetPosition().add(Look.multiplyScalar(-3.7));
        }
        ChangeOrbitCamera() {
            let sceneManager = JWFramework.SceneManager.getInstance();
            let picker = sceneManager.CurrentScene.Picker;
            this.cameraMode = JWFramework.CameraMode.CAMERA_ORBIT;
            picker.OrbitControl.enabled = true;
            let tartgetLocation = new THREE.Vector3;
            let gameObjectForCamera = sceneManager.CurrentScene.Picker.GetPickParents();
            gameObjectForCamera.GameObjectInstance.remove(this.MainCamera.CameraInstance);
            picker.OrbitControl.object.position.x = gameObjectForCamera.PhysicsComponent.GetPosition().x;
            picker.OrbitControl.object.position.y = gameObjectForCamera.PhysicsComponent.GetPosition().y + 15;
            picker.OrbitControl.object.position.z = gameObjectForCamera.PhysicsComponent.GetPosition().z;
            picker.OrbitControl.target = tartgetLocation.copy(gameObjectForCamera.PhysicsComponent.GetPosition());
            this.MainCamera.CameraInstance.lookAt(gameObjectForCamera.PhysicsComponent.GetPosition());
        }
    }
    JWFramework.CameraManager = CameraManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class PhysicsComponent {
        constructor(gameObject) {
            this.vec3Right = new THREE.Vector3(1, 0, 0);
            this.vec3Up = new THREE.Vector3(0, 1, 0);
            this.vec3Look = new THREE.Vector3(0, 0, 1);
            this.vec3Position = new THREE.Vector3(0, 0, 0);
            this.GameObject = gameObject;
            this.GameObject.PhysicsCompIncluded = true;
        }
        get Up() {
            return this.vec3Up;
        }
        get Right() {
            return this.vec3Right;
        }
        get Look() {
            return this.vec3Look;
        }
        set Up(vec3Up) {
            this.vec3Up = vec3Up;
        }
        set Right(vec3Right) {
            this.vec3Right = vec3Right;
        }
        set Look(vec3Look) {
            this.vec3Look = vec3Look;
        }
        SetPostion(x, y, z) {
            this.GameObject.GameObjectInstance.position.x = x;
            this.GameObject.GameObjectInstance.position.y = y;
            this.GameObject.GameObjectInstance.position.z = z;
            this.UpdateMatrix();
        }
        SetPostionVec3(vec3) {
            this.GameObject.GameObjectInstance.position.x = vec3.x;
            this.GameObject.GameObjectInstance.position.y = vec3.y;
            this.GameObject.GameObjectInstance.position.z = vec3.z;
            this.UpdateMatrix();
        }
        SetScale(x, y, z) {
            this.GameObject.GameObjectInstance.scale.set(x, y, z);
            this.UpdateMatrix();
        }
        SetScaleScalar(scalar) {
            this.GameObject.GameObjectInstance.scale.setScalar(scalar);
            this.UpdateMatrix();
        }
        MoveFoward(distance) {
            let Look = new THREE.Vector3(0, 0, 1);
            this.GameObject.GameObjectInstance.translateOnAxis(Look, distance * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        MoveDirection(direction, distance) {
            ;
            this.GameObject.GameObjectInstance.translateOnAxis(direction, distance * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        GetPosition() {
            return this.GameObject.GameObjectInstance.position;
        }
        GetRotateEuler() {
            return this.GameObject.GameObjectInstance.rotation;
        }
        GetRotateMatrix3() {
            let rotatematrix = new THREE.Matrix3();
            rotatematrix.set(this.Right.x, this.Right.y, this.Right.z, this.Up.x, this.Up.y, this.Up.z, this.Look.x, this.Look.y, this.Look.z);
            return rotatematrix;
        }
        GetScale() {
            return this.GameObject.GameObjectInstance.scale;
        }
        GetMaxVertex() {
            let vertices = new THREE.Vector3();
            let max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
            this.GameObject.GameObjectInstance.traverse(function (child) {
                if (child.geometry != undefined) {
                    let geo = child.geometry;
                    const position = geo.attributes.position;
                    for (let i = 0; i < position.count; i++) {
                        vertices.fromBufferAttribute(position, i);
                        max.max(vertices);
                    }
                }
            });
            return max;
        }
        GetMinVertex() {
            let vertices = new THREE.Vector3();
            let min = new THREE.Vector3(+Infinity, +Infinity, +Infinity);
            this.GameObject.GameObjectInstance.traverse(function (child) {
                if (child.geometry != undefined) {
                    let geo = child.geometry;
                    const position = geo.attributes.position;
                    for (let i = 0; i < position.count; i++) {
                        vertices.fromBufferAttribute(position, i);
                        min.min(vertices);
                    }
                }
            });
            return min;
        }
        GetMatrix4() {
            return this.GameObject.GameObjectInstance.matrixWorld;
        }
        SetRotate(x, y, z) {
            this.GameObject.GameObjectInstance.rotateX(x);
            this.GameObject.GameObjectInstance.rotateY(y);
            this.GameObject.GameObjectInstance.rotateZ(z);
            this.UpdateMatrix();
        }
        SetRotateVec3(vec3) {
            this.GameObject.GameObjectInstance.rotateX(vec3.x);
            this.GameObject.GameObjectInstance.rotateY(vec3.y);
            this.GameObject.GameObjectInstance.rotateZ(vec3.z);
            this.UpdateMatrix();
        }
        Rotate(x, y, z) {
            this.GameObject.GameObjectInstance.rotateX(x * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateY(y * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.GameObject.GameObjectInstance.rotateZ(z * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        RotateVec3(axis, angle) {
            this.GameObject.GameObjectInstance.rotateOnWorldAxis(axis, angle * JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.UpdateMatrix();
        }
        UpdateMatrix() {
            if (this.GameObject.Name != "MainCamera" && JWFramework.CameraManager.getInstance().CameraMode != JWFramework.CameraMode.CAMERA_3RD) {
                this.GameObject.GameObjectInstance.getWorldPosition(this.vec3Position);
            }
            else {
                this.vec3Position = this.GameObject.GameObjectInstance.position;
            }
            this.GameObject.GameObjectInstance.getWorldDirection(this.vec3Look);
            this.vec3Look = this.vec3Look.normalize();
            this.vec3Up.set(this.GameObject.GameObjectInstance.matrix.elements[4], this.GameObject.GameObjectInstance.matrix.elements[5], this.GameObject.GameObjectInstance.matrix.elements[6]);
            this.vec3Up = this.vec3Up.normalize();
            this.vec3Right = this.vec3Right.crossVectors(this.vec3Up, this.vec3Look);
            this.vec3Right = this.vec3Right.normalize();
        }
    }
    JWFramework.PhysicsComponent = PhysicsComponent;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUIManager {
        static getInstance() {
            if (!GUIManager.instance) {
                GUIManager.instance = new GUIManager;
            }
            return GUIManager.instance;
        }
        get GUI_Select() {
            if (this.gui_Select == null)
                GUIManager.instance.gui_Select = new JWFramework.GUI_Select();
            return this.gui_Select;
        }
        get GUI_SRT() {
            if (this.gui_SRT == null)
                GUIManager.instance.gui_SRT = new JWFramework.GUI_SRT(JWFramework.ObjectManager.getInstance().GetObjectFromName("MainCamera"));
            return this.gui_SRT;
        }
        get GUI_Terrain() {
            if (this.gui_Terrain == null)
                GUIManager.instance.gui_Terrain = new JWFramework.GUI_Terrain();
            return this.gui_Terrain;
        }
    }
    JWFramework.GUIManager = GUIManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class EditObject extends JWFramework.GameObject {
        constructor() {
            super();
            this.isTarget = false;
            this.throttle = 0;
            this.canLaunch = false;
            this.prevPosition = new THREE.Vector3(0, 0, 0);
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
            this.guiComponent = new JWFramework.GUIComponent(this);
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            let guiSrt = JWFramework.GUIManager.getInstance().GUI_SRT;
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else {
                if (guiSrt.DefaultEditableBounding == true) {
                    this.PhysicsComponent.SetScaleScalar(1);
                    this.PhysicsComponent.SetRotateVec3(guiSrt.DefaultRotate);
                    this.PhysicsComponent.SetScale(guiSrt.DefaultScale.x, guiSrt.DefaultScale.y, guiSrt.DefaultScale.z);
                    this.CollisionComponent.IsEditable = guiSrt.DefaultEditableBounding;
                    this.CollisionComponent.CreateOrientedBoundingBox(this.PhysicsComponent.GetPosition(), guiSrt.DefaultBounding.clone());
                    this.collisionComponent.IsEditable = true;
                    this.CollisionComponent.CreateRaycaster();
                }
                else {
                    this.PhysicsComponent.SetScaleScalar(1);
                    this.CreateCollider();
                }
                if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                    this.axisHelper = new THREE.AxesHelper(10);
                    this.axisHelper.material.fog = false;
                    this.axisHelper.material.depthTest = false;
                    this.GameObjectInstance.add(this.axisHelper);
                    this.guiComponent.GetLabel();
                }
            }
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition());
            this.collisionComponent.IsEditable = false;
            this.CollisionComponent.CreateRaycaster();
        }
        CollisionActive() {
        }
        CollisionDeActive() {
        }
        launchMissile() {
            if (this.canLaunch) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("R-60M"));
                cloneObject.PhysicsComponent.SetScale(1, 1, 1);
                cloneObject.GameObjectInstance.setRotationFromEuler(this.PhysicsComponent.GetRotateEuler());
                cloneObject.PhysicsComponent.SetPostionVec3(new THREE.Vector3(this.GameObjectInstance.position.x, this.GameObjectInstance.position.y, this.GameObjectInstance.position.z));
                cloneObject.PhysicsComponent.GetPosition().add(this.physicsComponent.Up.multiplyScalar(-3));
                cloneObject.AirCraftSpeed = this.throttle;
                objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
            }
        }
        Animate() {
            this.LabelOnOff();
            this.TargetTest();
            if (this.Picked == true) {
                this.IsRayOn = true;
                this.PhysicsComponent.MoveFoward(this.throttle);
                this.SpeedIndicaterProcess();
                this.InputProcess();
                this.SeekerProcess();
            }
            else {
                this.IsRayOn = false;
                this.throttle = 0;
            }
            this.EditHelperProcess();
            if (this.isClone == true)
                this.CollisionComponent.Update();
            if (this.AnimationMixer != null)
                this.AnimationMixer.update(JWFramework.WorldManager.getInstance().GetDeltaTime());
            this.prevPosition = this.PhysicsComponent.GetPosition().clone();
        }
        SpeedIndicaterProcess() {
            let moveDistance = this.physicsComponent.GetPosition().clone().sub(this.prevPosition).length();
            document.getElementById("speed").innerText = "속도 : " + JWFramework.UnitConvertManager.getInstance().ConvertToSpeedForKmh(moveDistance);
        }
        SeekerProcess() {
            let targetObject = JWFramework.ObjectManager.getInstance().GetObjectFromName("Target");
            if (targetObject != null) {
                let targetPos = targetObject.physicsComponent.GetPosition().clone();
                let playerPos = this.physicsComponent.GetPosition().clone();
                let lookVec = this.physicsComponent.Look.clone().normalize();
                let targetVec = targetPos.clone().sub(playerPos).normalize();
                let angleRad = Math.acos(lookVec.dot(targetVec));
                let angleDeg = THREE.MathUtils.radToDeg(angleRad);
                if (angleDeg <= 10) {
                    this.canLaunch = true;
                }
                else
                    this.canLaunch = false;
            }
        }
        TargetTest() {
            if (this.isTarget == true) {
                this.throttle = 50;
                this.PhysicsComponent.MoveFoward(this.throttle);
                this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Up, 0.5);
            }
        }
        LabelOnOff() {
            let cameraPosition = JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
            if (JWFramework.CameraManager.getInstance().CameraMode === JWFramework.CameraMode.CAMERA_3RD)
                JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
            if (this.GUIComponent.GetLabel().GameObjectInstance != null) {
                if (cameraPosition.sub(this.physicsComponent.GetPosition()).length() > 3000) {
                    this.GUIComponent.GetLabel().GameObjectInstance.visible = false;
                    this.GameObjectInstance.visible = false;
                }
                else {
                    this.GUIComponent.GetLabel().GameObjectInstance.visible = true;
                    this.GameObjectInstance.visible = true;
                }
            }
        }
        InputProcess() {
            let inputManager = JWFramework.InputManager.getInstance();
            if (JWFramework.SceneManager.getInstance().CurrentScene.GizmoOnOff == false) {
                if (inputManager.GetKeyState('left', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (inputManager.GetKeyState('right', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (inputManager.GetKeyState('down', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (inputManager.GetKeyState('up', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (inputManager.GetKeyState('w', JWFramework.KeyState.KEY_PRESS)) {
                    if (this.throttle < 100)
                        this.throttle += 20 * JWFramework.WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 100;
                }
                if (inputManager.GetKeyState('s', JWFramework.KeyState.KEY_PRESS)) {
                    if (this.throttle > 0)
                        this.throttle -= 20 * JWFramework.WorldManager.getInstance().GetDeltaTime();
                    else
                        this.throttle = 0;
                }
                if (inputManager.GetKeyState('f', JWFramework.KeyState.KEY_PRESS)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_3RD);
                }
                if (inputManager.GetKeyState('r', JWFramework.KeyState.KEY_PRESS)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_ORBIT);
                }
            }
            if (inputManager.GetKeyState('p', JWFramework.KeyState.KEY_DOWN)) {
                this.isTarget = true;
                this.name = "Target";
            }
            if (inputManager.GetKeyState('space', JWFramework.KeyState.KEY_DOWN)) {
                this.launchMissile();
            }
        }
        EditHelperProcess() {
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT && this.Picked == true) {
                JWFramework.SceneManager.getInstance().CurrentScene.AttachGizmo(this);
                this.axisHelper.visible = true;
                let cameraPosition = JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
                if (this.GUIComponent.GetLabel().GameObjectInstance != null) {
                    let size = cameraPosition.sub(this.physicsComponent.GetPosition()).length() / 100;
                    if (size <= 3)
                        size = 3;
                    this.axisHelper.scale.set(size, size, size);
                }
            }
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT && this.Picked == false) {
                JWFramework.SceneManager.getInstance().CurrentScene.DetachGizmo(this);
                this.axisHelper.visible = false;
            }
        }
    }
    JWFramework.EditObject = EditObject;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Missile extends JWFramework.GameObject {
        constructor() {
            super();
            this.aircraftSpeed = 0;
            this.velocity = 0;
            this.velocityGain = 0;
            this.velocityBreak = 0;
            this.maxVelocity = 80;
            this.maxResultSpeed = 0;
            this.resultSpeed = 0;
            this.rotaspeed = 0;
            this.maxRotateSpeed = 20;
            this.rotateSpeedAcceletion = 20;
            this.predictionDistance = 200;
            this.endHomingStartLenge = 0;
            this.angle = 500;
            this.activeColide = false;
            this.deAcceleration = false;
            this.type = JWFramework.ObjectType.OBJ_MISSILE;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
        }
        InitializeAfterLoad() {
            this.targetObject = JWFramework.ObjectManager.getInstance().GetObjectFromName("Target");
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else {
                let flameMaterial = new THREE.SpriteMaterial({
                    map: JWFramework.ShaderManager.getInstance().missileFlameTexture,
                    transparent: true,
                });
                this.missileFlameMesh = new THREE.Sprite(flameMaterial);
                this.GameObjectInstance.add(this.missileFlameMesh);
                this.missileFlameMesh.scale.set(5, 5, 5);
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Look, -1.2);
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Right, -0.04);
                this.missileFlameMesh.position.addScaledVector(this.PhysicsComponent.Up, 0.05);
                this.CreateCollider();
            }
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }
        CollisionActive(type = null) {
            if (type == JWFramework.ObjectType.OBJ_TERRAIN)
                this.activeColide = true;
            if (this.activeColide == true)
                this.isDead = true;
        }
        CollisionDeActive() {
        }
        get AirCraftSpeed() {
            return this.aircraftSpeed;
        }
        set AirCraftSpeed(speed) {
            this.aircraftSpeed = speed;
        }
        Animate() {
            this.isRayOn = true;
            if (this.targetObject != undefined) {
                let length = new THREE.Vector3().subVectors(this.targetObject.PhysicsComponent.GetPosition().clone(), this.PhysicsComponent.GetPosition().clone()).length();
                let targetDirection;
                this.activeColide = true;
                if (length >= this.endHomingStartLenge) {
                    this.predictionDistance = length - (length / 2);
                }
                else {
                    this.predictionDistance = 0;
                }
                if (this.rotaspeed < this.maxRotateSpeed)
                    this.rotaspeed += this.rotateSpeedAcceletion * JWFramework.WorldManager.getInstance().GetDeltaTime();
                else {
                    this.rotaspeed = this.maxRotateSpeed;
                }
                let nextPos = this.targetObject.PhysicsComponent.GetPosition().clone().add(this.targetObject.PhysicsComponent.Look.clone().multiplyScalar(this.predictionDistance));
                targetDirection = new THREE.Vector3().subVectors(nextPos, this.PhysicsComponent.GetPosition().clone()).normalize();
                const currentDirection = new THREE.Vector3(0, 0, 1).applyEuler(this.PhysicsComponent.GetRotateEuler());
                const angle = currentDirection.angleTo(targetDirection);
                const axis = new THREE.Vector3().crossVectors(currentDirection, targetDirection).normalize();
                let maxSpeed = this.rotaspeed;
                let maxRadius = this.angle;
                let speed = maxSpeed * (angle / maxRadius);
                speed = Math.min(speed, maxSpeed);
                const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, speed);
                const currentRotation = new THREE.Quaternion();
                currentRotation.setFromEuler(this.PhysicsComponent.GetRotateEuler());
                const nextRotation = new THREE.Euler().setFromQuaternion(quaternion.multiply(currentRotation));
                this.GameObjectInstance.setRotationFromEuler(nextRotation);
                if (this.deAcceleration == false && this.velocity <= this.maxVelocity) {
                    this.velocity += (this.velocityGain * JWFramework.WorldManager.getInstance().GetDeltaTime());
                    this.resultSpeed = this.aircraftSpeed + this.velocity;
                }
                else if (this.deAcceleration == false && this.maxResultSpeed <= this.resultSpeed) {
                    this.deAcceleration = true;
                    this.resultSpeed = this.maxResultSpeed;
                }
                if (this.deAcceleration == true)
                    this.resultSpeed -= (this.velocityBreak * JWFramework.WorldManager.getInstance().GetDeltaTime());
                if (this.resultSpeed <= 60) {
                    this.resultSpeed = this.maxVelocity;
                }
                this.PhysicsComponent.MoveFoward(this.resultSpeed);
            }
            else
                this.PhysicsComponent.MoveFoward(120);
            let missileFog = new JWFramework.MissileFog();
            missileFog.IsClone = true;
            missileFog.PhysicsComponent.SetPostion(this.PhysicsComponent.GetPosition().x + Math.random() * 3, this.PhysicsComponent.GetPosition().y + Math.random() * 3, this.PhysicsComponent.GetPosition().z);
            missileFog.PhysicsComponent.SetScale(0.5, 0.5, 0.5);
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
        }
    }
    JWFramework.Missile = Missile;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class AIM9H extends JWFramework.Missile {
        constructor() {
            super();
        }
        InitializeAfterLoad() {
            super.InitializeAfterLoad();
            this.velocityGain = 40;
            this.velocityBreak = 1;
            this.maxVelocity = 80;
            this.maxRotateSpeed = 18;
            this.rotateSpeedAcceletion = 5;
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }
        CollisionActive(type) {
            super.CollisionActive(type);
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.maxResultSpeed == 0)
                this.maxResultSpeed = this.maxVelocity + this.AirCraftSpeed;
            let reletiveSpeed = this.resultSpeed - this.targetObject.throttle;
            if (reletiveSpeed > this.targetObject.throttle)
                this.endHomingStartLenge = 100;
            else
                this.endHomingStartLenge = 0;
            super.Animate();
        }
    }
    JWFramework.AIM9H = AIM9H;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class AIM9L extends JWFramework.Missile {
        constructor() {
            super();
        }
        InitializeAfterLoad() {
            super.InitializeAfterLoad();
            this.velocityGain = 40;
            this.velocityBreak = 1.5;
            this.maxVelocity = 80;
            this.maxRotateSpeed = 30;
            this.rotateSpeedAcceletion = 15;
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }
        CollisionActive(type) {
            super.CollisionActive(type);
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.maxResultSpeed == 0)
                this.maxResultSpeed = this.maxVelocity + this.AirCraftSpeed;
            let reletiveSpeed = this.resultSpeed - this.targetObject.throttle;
            if (reletiveSpeed > this.targetObject.throttle)
                this.endHomingStartLenge = 50;
            else
                this.endHomingStartLenge = 0;
            super.Animate();
        }
    }
    JWFramework.AIM9L = AIM9L;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class R60M extends JWFramework.Missile {
        constructor() {
            super();
        }
        InitializeAfterLoad() {
            super.InitializeAfterLoad();
            this.velocityGain = 30;
            this.velocityBreak = 2;
            this.maxVelocity = 80;
            this.maxRotateSpeed = 30;
            this.rotateSpeedAcceletion = 20;
        }
        CreateCollider() {
            this.CollisionComponent.CreateOrientedBoundingBox(this.physicsComponent.GetPosition(), new THREE.Vector3(1.5, 1.5, 1.5));
            this.CollisionComponent.CreateRaycaster();
            this.CollisionComponent.ObbBoxHelper.visible = false;
        }
        CollisionActive(type) {
            super.CollisionActive(type);
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.maxResultSpeed == 0)
                this.maxResultSpeed = this.maxVelocity + this.AirCraftSpeed;
            let reletiveSpeed = this.resultSpeed - this.targetObject.throttle;
            if (reletiveSpeed > this.targetObject.throttle)
                this.endHomingStartLenge = 50;
            else
                this.endHomingStartLenge = 0;
            super.Animate();
        }
    }
    JWFramework.R60M = R60M;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Water extends JWFramework.GameObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_WATER;
            this.name = "Water";
        }
        InitializeAfterLoad() {
            if (this.IsClone == true) {
                this.graphicComponent = new JWFramework.GraphComponent(this);
                this.physicsComponent = new JWFramework.PhysicsComponent(this);
                this.exportComponent = new JWFramework.ExportComponent(this);
                this.CreateWaterMesh();
                this.GameObjectInstance.matrixAutoUpdate = true;
                this.GameObjectInstance.name = this.name;
            }
            else {
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            }
        }
        CreateWaterMesh() {
            this.geometry = new THREE.PlaneGeometry(900, 900, 4, 4);
            this.mesh = new THREE.Water(this.geometry, {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('Object/InGameObject/Envirument/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(1, 1, 0),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 2,
                fog: true
            });
            this.mesh.name = "WaterMesh";
            this.mesh.rotation.x = -Math.PI / 2;
            this.GameObjectInstance = this.mesh;
        }
        Animate() {
            this.mesh.material.uniforms['time'].value += 1 * JWFramework.WorldManager.getInstance().GetDeltaTime();
        }
    }
    JWFramework.Water = Water;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class MissileFog extends JWFramework.GameObject {
        constructor() {
            super();
            this.fogLifeTime = 4;
            this.currentTime = 0;
            this.type = JWFramework.ObjectType.OBJ_OBJECT2D;
            this.name = "MissileFog" + JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.CreateBillboardMesh();
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
        CreateBillboardMesh() {
            this.material = new THREE.SpriteMaterial({
                map: JWFramework.ShaderManager.getInstance().fogTexture,
                transparent: true,
                opacity: 0.8
            });
            this.mesh = new THREE.Sprite(this.material);
            this.GameObjectInstance = this.mesh;
            this.InitializeAfterLoad();
        }
        *FogStateUpdate() {
            this.currentTime += 1 * JWFramework.WorldManager.getInstance().GetDeltaTime();
            this.physicsComponent.SetScaleScalar(this.currentTime * 3);
            const material = this.GameObjectInstance.material;
            while (material.opacity >= 0) {
                material.opacity -= 0.2 * JWFramework.WorldManager.getInstance().GetDeltaTime();
                yield;
            }
            this.isDead = true;
            yield null;
        }
        Animate() {
            let generator = this.FogStateUpdate();
            generator.next();
        }
    }
    JWFramework.MissileFog = MissileFog;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Define {
    }
    Define.SCREEN_WIDTH = window.innerWidth;
    Define.SCREEN_HEIGHT = window.innerHeight;
    JWFramework.Define = Define;
    class ModelSceneBase {
        constructor() {
            this.sceneModelData = [];
            this.sceneModelData = [];
            this.modelNumber = this.sceneModelData.length;
        }
        static getInstance(modelSceneType) {
            if (!ModelSceneBase.instance) {
                ModelSceneBase.instance = new JWFramework[modelSceneType];
            }
            return ModelSceneBase.instance;
        }
        get ModelScene() {
            return this.sceneModelData;
        }
        get ModelNumber() {
            return this.modelNumber;
        }
    }
    JWFramework.ModelSceneBase = ModelSceneBase;
    class ModelSceneEdit extends ModelSceneBase {
        constructor() {
            super();
            this.tree = new JWFramework.EditObject;
            this.mig29 = new JWFramework.EditObject;
            this.f_5e = new JWFramework.EditObject;
            this.anim = new JWFramework.EditObject;
            this.water = new JWFramework.Water;
            this.mig29.Name = "MIG_29";
            this.tree.Name = "Tree";
            this.f_5e.Name = "F-5E";
            this.anim.Name = "Animation";
            this.water.Name = "Water";
            this.sceneModelData = [
                { model: this.mig29, url: 'Model/mig_29_1.glb' },
                { model: this.tree, url: 'Model/Tree/tree_lv3.glb' },
                { model: this.f_5e, url: 'Model/F-5E.glb' },
                { model: this.anim, url: 'Model/Sprint.glb' },
                { model: this.water, url: null },
            ];
            this.modelNumber = this.sceneModelData.length;
        }
    }
    JWFramework.ModelSceneEdit = ModelSceneEdit;
    class ModelSceneStage {
        constructor() {
            this.F16 = new JWFramework.EditObject;
            this.sceneTestModel = [];
            this.F16.Name = "F-16";
            this.sceneTestModel = [
                { model: this.F16, url: 'Model/F-16D/F-16.gltf' },
            ];
            this.modelNumber = this.sceneTestModel.length;
        }
        static getInstance() {
            if (!ModelSceneStage.instance) {
                ModelSceneStage.instance = new ModelSceneStage;
            }
            return ModelSceneStage.instance;
        }
        get ModelScene() {
            return this.sceneTestModel;
        }
        get ModelNumber() {
            return this.modelNumber;
        }
    }
    JWFramework.ModelSceneStage = ModelSceneStage;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    let SceneType;
    (function (SceneType) {
        SceneType[SceneType["SCENE_EDIT"] = 0] = "SCENE_EDIT";
        SceneType[SceneType["SCENE_START"] = 1] = "SCENE_START";
        SceneType[SceneType["SCENE_STAGE"] = 2] = "SCENE_STAGE";
        SceneType[SceneType["SCENE_END"] = 3] = "SCENE_END";
    })(SceneType = JWFramework.SceneType || (JWFramework.SceneType = {}));
    let ObjectType;
    (function (ObjectType) {
        ObjectType[ObjectType["OBJ_TERRAIN"] = 0] = "OBJ_TERRAIN";
        ObjectType[ObjectType["OBJ_WATER"] = 1] = "OBJ_WATER";
        ObjectType[ObjectType["OBJ_OBJECT3D"] = 2] = "OBJ_OBJECT3D";
        ObjectType[ObjectType["OBJ_OBJECT2D"] = 3] = "OBJ_OBJECT2D";
        ObjectType[ObjectType["OBJ_AIRCRAFT"] = 4] = "OBJ_AIRCRAFT";
        ObjectType[ObjectType["OBJ_MISSILE"] = 5] = "OBJ_MISSILE";
        ObjectType[ObjectType["OBJ_CAMERA"] = 6] = "OBJ_CAMERA";
        ObjectType[ObjectType["OBJ_LIGHT"] = 7] = "OBJ_LIGHT";
        ObjectType[ObjectType["OBJ_END"] = 8] = "OBJ_END";
    })(ObjectType = JWFramework.ObjectType || (JWFramework.ObjectType = {}));
    let LightType;
    (function (LightType) {
        LightType[LightType["LIGHT_DIRECTIONAL"] = 0] = "LIGHT_DIRECTIONAL";
        LightType[LightType["LIGHT_AMBIENT"] = 1] = "LIGHT_AMBIENT";
    })(LightType = JWFramework.LightType || (JWFramework.LightType = {}));
    let PickMode;
    (function (PickMode) {
        PickMode[PickMode["PICK_MODIFY"] = 0] = "PICK_MODIFY";
        PickMode[PickMode["PICK_CLONE"] = 1] = "PICK_CLONE";
        PickMode[PickMode["PICK_TERRAIN"] = 2] = "PICK_TERRAIN";
        PickMode[PickMode["PICK_DUMMYTERRAIN"] = 3] = "PICK_DUMMYTERRAIN";
        PickMode[PickMode["PICK_REMOVE"] = 4] = "PICK_REMOVE";
    })(PickMode = JWFramework.PickMode || (JWFramework.PickMode = {}));
    let TerrainOption;
    (function (TerrainOption) {
        TerrainOption[TerrainOption["TERRAIN_UP"] = 0] = "TERRAIN_UP";
        TerrainOption[TerrainOption["TERRAIN_DOWN"] = 1] = "TERRAIN_DOWN";
        TerrainOption[TerrainOption["TERRAIN_BALANCE"] = 2] = "TERRAIN_BALANCE";
        TerrainOption[TerrainOption["TERRAIN_LOAD"] = 3] = "TERRAIN_LOAD";
        TerrainOption[TerrainOption["TERRAIN_END"] = 4] = "TERRAIN_END";
    })(TerrainOption = JWFramework.TerrainOption || (JWFramework.TerrainOption = {}));
    let CameraMode;
    (function (CameraMode) {
        CameraMode[CameraMode["CAMERA_ORBIT"] = 0] = "CAMERA_ORBIT";
        CameraMode[CameraMode["CAMERA_3RD"] = 1] = "CAMERA_3RD";
    })(CameraMode = JWFramework.CameraMode || (JWFramework.CameraMode = {}));
    let KeyState;
    (function (KeyState) {
        KeyState[KeyState["KEY_DOWN"] = 0] = "KEY_DOWN";
        KeyState[KeyState["KEY_PRESS"] = 1] = "KEY_PRESS";
        KeyState[KeyState["KEY_UP"] = 2] = "KEY_UP";
    })(KeyState = JWFramework.KeyState || (JWFramework.KeyState = {}));
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUI_Base {
        constructor() { }
        CreateFolder(name) { }
    }
    JWFramework.GUI_Base = GUI_Base;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUI_Select extends JWFramework.GUI_Base {
        constructor() {
            super();
            this.List = {
                ObjectList: "None"
            };
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'select-gui-container';
            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
        }
        CreateFolder() {
            this.objectListFolder = this.datGui.addFolder('ObjectList');
            this.exportButtonFolder = this.datGui.addFolder('Output');
        }
        AddElement() {
            let item = [];
            let objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            for (let TYPE = JWFramework.ObjectType.OBJ_OBJECT3D; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ) {
                    if (objectList[TYPE][OBJ].GameObject instanceof JWFramework.EditObject)
                        item.push(objectList[TYPE][OBJ].Name);
                }
            }
            item.push("Water");
            this.objectListFolder.add(this.List, 'ObjectList', item);
            this.objectListFolder.open();
            this.makeJson = function () {
                this.ExportData = function () { JWFramework.SceneManager.getInstance().MakeJSON(); };
            };
            this.makeJson = new this.makeJson();
            this.exportButtonFolder.add(this.makeJson, 'ExportData');
            this.exportButtonFolder.open();
        }
        GetSelectObjectName() {
            return this.List.ObjectList;
        }
    }
    JWFramework.GUI_Select = GUI_Select;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUI_SRT extends JWFramework.GUI_Base {
        constructor(gameObject) {
            super();
            this.defaultEditableBounding = false;
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'srt-gui-container';
            this.datGui.open();
            this.gameObject = gameObject;
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
            this.defaultRotate = new THREE.Vector3(0, 0, 0);
            this.defaultScale = new THREE.Vector3(1, 1, 1);
            this.defaultBounding = new THREE.Vector3(1, 1, 1);
        }
        CreateFolder() {
            this.positionFolder = this.datGui.addFolder('Position');
            this.rotateFolder = this.datGui.addFolder('Rotate');
            this.scaleFolder = this.datGui.addFolder('Scale');
            this.boundingBoxFolder = this.datGui.addFolder("BoundingBox");
            this.isPlayerFolder = this.datGui.addFolder('IsPlayer');
        }
        AddElement() {
            if (this.gameObject == undefined) {
                this.rotateFolder.add(this.defaultRotate, 'x', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.defaultRotate, 'y', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.defaultRotate, 'z', 0, Math.PI * 2).listen();
                this.rotateFolder.open();
                this.scaleFolder.add(this.defaultScale, 'x', 0).step(0.01).listen();
                this.scaleFolder.add(this.defaultScale, 'y', 0).step(0.01).listen();
                this.scaleFolder.add(this.defaultScale, 'z', 0).step(0.01).listen();
                this.scaleFolder.open();
                this.boundingBoxFolder.add(this.defaultBounding, 'x', 0).step(0.01).listen();
                this.boundingBoxFolder.add(this.defaultBounding, 'y', 0).step(0.01).listen();
                this.boundingBoxFolder.add(this.defaultBounding, 'z', 0).step(0.01).listen();
                const onChangeIsBoundingEditable = function (value) {
                    JWFramework.GUIManager.getInstance().GUI_SRT.defaultEditableBounding = value;
                };
                this.boundingBoxFolder.add({ isBoundingEditable: this.defaultEditableBounding }, 'isBoundingEditable')
                    .name('Enable Bounding Editable')
                    .onChange(onChangeIsBoundingEditable);
                this.boundingBoxFolder.open();
            }
            else if (this.gameObject.IsClone && this.gameObject.Picked) {
                this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'x').step(0.01).listen();
                this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'y').step(0.01).listen();
                this.positionFolder.add(this.gameObject.GameObjectInstance.position, 'z').step(0.01).listen();
                this.positionFolder.open();
                this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'x', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'y', 0, Math.PI * 2).listen();
                this.rotateFolder.add(this.gameObject.GameObjectInstance.rotation, 'z', 0, Math.PI * 2).listen();
                this.rotateFolder.open();
                this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'x', 0).step(0.01).listen();
                this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'y', 0).step(0.01).listen();
                this.scaleFolder.add(this.gameObject.GameObjectInstance.scale, 'z', 0).step(0.01).listen();
                this.scaleFolder.open();
                this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'x').step(0.01).listen();
                this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'y').step(0.01).listen();
                this.boundingBoxFolder.add(this.gameObject.CollisionComponent.halfSize, 'z').step(0.01).listen();
                const onChangeIsBoundingEditable = function (value) {
                    JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.CollisionComponent.IsEditable = value;
                    JWFramework.GUIManager.getInstance().GUI_SRT.SetGameObject(JWFramework.GUIManager.getInstance().GUI_SRT.gameObject);
                };
                this.boundingBoxFolder.add({ isBoundingEditable: JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.CollisionComponent.IsEditable }, 'isBoundingEditable')
                    .name('Enable Bounding Editable')
                    .onChange(onChangeIsBoundingEditable);
                this.boundingBoxFolder.open();
                this.isPlayerFunc = function () {
                    this.isPlayer = function () {
                        JWFramework.GUIManager.getInstance().GUI_SRT.gameObject.IsPlayer = true;
                    };
                };
                this.isPlayerFunc = new this.isPlayerFunc();
                this.isPlayerFolder.add(this.isPlayerFunc, 'isPlayer');
                this.isPlayerFolder.open();
            }
        }
        SetGameObject(gameObject) {
            this.gameObject = gameObject;
            this.datGui.removeFolder(this.positionFolder);
            this.datGui.removeFolder(this.rotateFolder);
            this.datGui.removeFolder(this.scaleFolder);
            this.datGui.removeFolder(this.boundingBoxFolder);
            this.datGui.removeFolder(this.isPlayerFolder);
            this.CreateFolder();
            this.AddElement();
        }
        UpdateDisplay() {
            this.datGui.updateDisplay();
        }
        ShowGUI(show) {
            if (show == true) {
                this.datGui.open();
            }
            else {
                this.datGui.close();
            }
            this.gameObject.PhysicsComponent.UpdateMatrix();
        }
        get DefaultRotate() {
            return this.defaultRotate;
        }
        get DefaultScale() {
            return this.defaultScale;
        }
        get DefaultBounding() {
            return this.defaultBounding;
        }
        get DefaultEditableBounding() {
            return this.defaultEditableBounding;
        }
    }
    JWFramework.GUI_SRT = GUI_SRT;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class GUI_Terrain extends JWFramework.GUI_Base {
        constructor() {
            super();
            this.propList = {
                TerrianOptiontList: "None",
                HeightOffset: 0
            };
            this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            this.datGui = new dat.GUI();
            this.datGui.domElement.id = 'terrain-gui-container';
            this.datGui.open();
            this.CreateFolder();
            this.AddElement();
            this.datGui.width = JWFramework.WorldManager.getInstance().Canvas.width / 8;
        }
        CreateFolder() {
            this.terrainOptionFolder = this.datGui.addFolder('Terrain');
        }
        AddElement() {
            let item = [];
            item.push('UP');
            item.push('DOWN');
            item.push('BALANCE');
            this.terrainOptionFolder.add(this.propList, 'TerrianOptiontList', item).listen();
            this.terrainOptionFolder.add(this.propList, 'HeightOffset').step(0.01).listen();
            this.propList.TerrianOptiontList = 'UP';
            this.terrainOptionFolder.open();
        }
        GetTerrainOption() {
            return this.terrainOption;
        }
        GetHeightOffset() {
            return this.propList.HeightOffset;
        }
        ChangeHeightOffset() {
            if (this.propList.HeightOffset == 0)
                this.propList.HeightOffset = -1;
            else if (this.propList.HeightOffset == -1)
                this.propList.HeightOffset = 1;
            else if (this.propList.HeightOffset == 1)
                this.propList.HeightOffset = 0;
            this.propList.HeightOffset;
        }
        ChangeTerrainOption() {
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_BALANCE)
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            else
                this.terrainOption++;
            this.SetTerrainOptionFromEnum();
        }
        SetTerrainOptionFromEnum() {
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_UP)
                this.propList.TerrianOptiontList = 'UP';
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_DOWN)
                this.propList.TerrianOptiontList = 'DOWN';
            if (this.terrainOption == JWFramework.TerrainOption.TERRAIN_BALANCE)
                this.propList.TerrianOptiontList = 'BALANCE';
        }
        SetTerrainOptionList() {
            if (this.propList.TerrianOptiontList == 'UP')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_UP;
            if (this.propList.TerrianOptiontList == 'DOWN')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_DOWN;
            if (this.propList.TerrianOptiontList == 'BALANCE')
                this.terrainOption = JWFramework.TerrainOption.TERRAIN_BALANCE;
        }
    }
    JWFramework.GUI_Terrain = GUI_Terrain;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Camera extends JWFramework.GameObject {
        constructor() {
            super();
            this.y = 0;
            this.type = JWFramework.ObjectType.OBJ_CAMERA;
            this.fov = 75;
            this.aspect = JWFramework.Define.SCREEN_WIDTH / JWFramework.Define.SCREEN_HEIGHT;
            this.near = 0.1;
            this.far = 1000;
            this.cameraInstance = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
            this.GameObjectInstance = this.CameraInstance;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
            this.CollisionComponent.CreateBoundingBox(300, 1, 300);
            this.GameObjectInstance.matrixAutoUpdate = true;
        }
        get Fov() {
            return this.fov;
        }
        set Fov(fov) {
            this.fov = fov;
            this.SetCameraElement();
        }
        get Aspect() {
            return this.aspect;
        }
        set Aspect(aspect) {
            this.aspect = aspect;
            this.SetCameraElement();
        }
        get Near() {
            return this.Near;
        }
        set Near(near) {
            this.near = near;
            this.SetCameraElement();
        }
        get Far() {
            return this.far;
        }
        set Far(far) {
            this.far = far;
            this.SetCameraElement();
        }
        get CameraInstance() {
            return this.cameraInstance;
        }
        SetCameraElement() {
            this.cameraInstance.fov = this.fov;
            this.cameraInstance.aspect = this.aspect;
            this.cameraInstance.near = this.near;
            this.cameraInstance.far = this.far;
            this.cameraInstance.updateProjectionMatrix();
        }
        Animate() {
            this.CollisionComponent.Update();
            this.PhysicsComponent.UpdateMatrix();
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
    }
    JWFramework.Camera = Camera;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ObjectManager {
        constructor() {
            this.objectId = 0;
            this.terrainList = new THREE.Group();
            this.objectList = [[], [], [], [], [], [], [], []];
            this.exportObjectList = [];
        }
        static getInstance() {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        }
        GetObjectsFromType() { }
        GetObjectFromName(name) {
            for (let TYPE = JWFramework.ObjectType.OBJ_TERRAIN; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (name == this.objectList[TYPE][OBJ].GameObject.Name) {
                        return this.objectList[TYPE][OBJ].GameObject;
                    }
                }
            }
            return null;
        }
        GetInSectorTerrain() {
            let terrain;
            for (let OBJ = 0; OBJ < this.objectList[JWFramework.ObjectType.OBJ_TERRAIN].length; ++OBJ) {
                terrain = this.objectList[JWFramework.ObjectType.OBJ_TERRAIN][OBJ].GameObject;
                if (terrain.cameraInSecter == true)
                    this.terrainList.add(terrain.GameObjectInstance);
            }
            return this.terrainList;
        }
        get GetObjectList() {
            return this.objectList;
        }
        get PickableObjectList() {
            let obj2d = this.objectList[JWFramework.ObjectType.OBJ_OBJECT2D].filter(o_ => o_.GameObject.IsClone);
            let obj3d = this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D].filter(o_ => o_.GameObject.IsClone);
            let water = this.objectList[JWFramework.ObjectType.OBJ_WATER].filter(o_ => o_.GameObject.IsClone);
            return obj2d.concat(obj3d).filter(o_ => !o_.Name.includes("cloud") && o_.GameObject.IsClone).concat(water);
        }
        ClearExportObjectList() {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }
        AddObject(gameObject, name, type) {
            this.objectList[type].push({ GameObject: gameObject, Name: name });
            if (gameObject.IsClone == true && type != JWFramework.ObjectType.OBJ_CAMERA) {
                JWFramework.SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
            }
        }
        MakeClone(selectObject) {
            let cloneObject;
            if (selectObject instanceof JWFramework.EditObject) {
                cloneObject = new JWFramework.EditObject;
            }
            else if (selectObject instanceof JWFramework.AIM9H) {
                cloneObject = new JWFramework.AIM9H;
            }
            else if (selectObject instanceof JWFramework.AIM9L) {
                cloneObject = new JWFramework.AIM9L;
            }
            else if (selectObject instanceof JWFramework.R60M) {
                cloneObject = new JWFramework.R60M;
            }
            else if (selectObject instanceof JWFramework.Cloud) {
                cloneObject = new JWFramework.Cloud;
            }
            else if (selectObject instanceof JWFramework.Water) {
                cloneObject = new JWFramework.Water;
            }
            else {
                if (selectObject == null)
                    alert("EmptyObject");
                else
                    alert(selectObject.Name.toUpperCase() + " Instance of class name not found");
                return;
            }
            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + this.objectId;
            if (selectObject.ModelData != null) {
                if (selectObject.ModelData.animations.length != 0) {
                    cloneObject.ModelData = selectObject.ModelData;
                    cloneObject.GameObjectInstance = THREE.SkeletonUtils.clone(cloneObject.ModelData.scene);
                    cloneObject.AnimationMixer = new THREE.AnimationMixer(cloneObject.GameObjectInstance);
                    cloneObject.AnimationMixer.clipAction(cloneObject.ModelData.animations[0]).play();
                }
                else
                    cloneObject.GameObjectInstance = selectObject.ModelData.scene.clone();
            }
            cloneObject.InitializeAfterLoad();
            this.objectId++;
            return cloneObject;
        }
        MakeJSONArray() {
            for (let TYPE = JWFramework.ObjectType.OBJ_TERRAIN; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (this.objectList[TYPE][OBJ].GameObject.IsClone == true || this.objectList[TYPE][OBJ].GameObject.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        if (this.objectList[TYPE][OBJ].GameObject.ExportComponent != undefined)
                            this.exportObjectList.push(this.objectList[TYPE][OBJ].GameObject.ExportComponent.MakeJsonObject());
                    }
                }
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(this.exportObjectList, null, 2)], {
                type: "text/plain"
            }));
            a.setAttribute("download", "Scene.json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.ClearExportObjectList();
        }
        DeleteObject(gameObject) {
            gameObject.GameObjectInstance.traverse(node => {
                if (node.isMesh || node.isGroup || node.isSprite) {
                    if (node.geometry) {
                        node.geometry.dispose();
                    }
                    if (node.material)
                        if (Array.isArray(node.material)) {
                            for (let i = 0; i < node.material.length; ++i) {
                                node.material[i].dispose();
                                if (node.material[i].map)
                                    node.material[i].map.dispose();
                            }
                        }
                        else {
                            node.material.dispose();
                            if (node.material.map)
                                node.material.map.dispose();
                        }
                }
            });
            if (gameObject instanceof JWFramework.HeightmapTerrain) {
                gameObject.inSectorObject = [];
                gameObject.inSectorObject = null;
            }
            if (gameObject.CollisionComponent != undefined)
                gameObject.CollisionComponent.DeleteCollider();
            gameObject.DeleteAllComponent();
            delete gameObject.ModelData;
            gameObject.ModelData = null;
            delete gameObject.GameObjectInstance.children;
            gameObject.GameObjectInstance.removeFromParent();
            JWFramework.SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
            delete gameObject.GameObjectInstance;
            gameObject.GameObjectInstance = null;
            gameObject = null;
            this.ClearExportObjectList();
        }
        DeleteAllObject() {
            this.objectList.forEach(function (type) {
                type.forEach(function (object) {
                    if (object.GameObject.Type != JWFramework.ObjectType.OBJ_CAMERA && object.GameObject.IsClone == true) {
                        object.GameObject.IsDead = true;
                    }
                });
            });
        }
        RenderOffObject() { }
        Animate() {
            for (let TYPE = 0; TYPE < JWFramework.ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (this.objectList[TYPE][OBJ].GameObject.IsClone)
                        this.objectList[TYPE][OBJ].GameObject.Animate();
                    if (this.objectList[TYPE][OBJ].GameObject.PhysicsCompIncluded == true)
                        this.objectList[TYPE][OBJ].GameObject.PhysicsComponent.UpdateMatrix();
                    if (this.objectList[TYPE][OBJ].GameObject.IsDead) {
                        this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                        this.objectList[TYPE][OBJ] = null;
                        delete this.objectList[TYPE][OBJ];
                        this.objectList[TYPE] = this.objectList[TYPE].filter((element) => element !== undefined);
                    }
                }
            }
            JWFramework.CollisionManager.getInstance().CollideObbToBox(this.objectList[JWFramework.ObjectType.OBJ_OBJECT3D], this.objectList[JWFramework.ObjectType.OBJ_TERRAIN].filter(o => o.GameObject.IsDummy == false));
            JWFramework.CollisionManager.getInstance().CollideObbToBox(this.objectList[JWFramework.ObjectType.OBJ_MISSILE], this.objectList[JWFramework.ObjectType.OBJ_TERRAIN].filter(o => o.GameObject.IsDummy == false));
            let sectoredTerrain = this.objectList[JWFramework.ObjectType.OBJ_TERRAIN].filter((element) => element.GameObject.inSecter == true);
            JWFramework.CollisionManager.getInstance().CollideRayToTerrain(sectoredTerrain);
            JWFramework.CollisionManager.getInstance().CollideRayToWater(this.objectList[JWFramework.ObjectType.OBJ_WATER].filter(o_ => o_.GameObject.IsClone));
            sectoredTerrain.forEach(function (src) {
                JWFramework.CollisionManager.getInstance().CollideObbToObb(src.GameObject.inSectorObject, src.GameObject.inSectorObject);
            });
            JWFramework.InputManager.getInstance().UpdateKey();
        }
        Render() { }
    }
    JWFramework.ObjectManager = ObjectManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Picker {
        constructor() {
            this.pickPositionX = 0;
            this.pickPositionY = 0;
            this.enablePickOff = true;
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.enablePickOff = true;
            this.pickMode = JWFramework.PickMode.PICK_MODIFY;
            this.CreateOrtbitControl();
            window.addEventListener('mousemove', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.mouseEvent = e;
            });
            window.addEventListener('click', function (e) {
                if (JWFramework.SceneManager.getInstance().CurrentScene.Picker.EnablePickOff)
                    JWFramework.SceneManager.getInstance().CurrentScene.Picker.SetPickPosition(e);
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.EnablePickOff = true;
            });
            window.addEventListener('mouseout', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
            window.addEventListener('mouseleave', function (e) {
                JWFramework.SceneManager.getInstance().CurrentScene.Picker.ClearPickPosition();
            });
        }
        CreateOrtbitControl() {
            this.orbitControl = new THREE.OrbitControls(JWFramework.WorldManager.getInstance().MainCamera.CameraInstance, JWFramework.WorldManager.getInstance().Canvas);
            this.orbitControl.maxDistance = 4000;
            this.orbitControl.minDistance = -4000;
            this.orbitControl.zoomSpeed = 2;
            this.orbitControl.maxZoom = -4000;
            this.orbitControl.panSpeed = 3;
        }
        GetParentName(intersectedObjects) {
            if (intersectedObjects != null) {
                if (intersectedObjects.type == "Mesh") {
                    if (intersectedObjects.name.includes("ObbHelper")) {
                        let parentName = intersectedObjects.name.replace("ObbHelper", "");
                        this.pickedParentName = parentName;
                        return;
                    }
                    else {
                        this.pickedParentName = intersectedObjects.name;
                        return;
                    }
                }
                if (intersectedObjects.type == "Sprite") {
                    this.pickedParentName = intersectedObjects.name;
                }
                if (intersectedObjects.type != "Group") {
                    this.GetParentName(intersectedObjects.parent);
                }
                else {
                    this.pickedParentName = intersectedObjects.name;
                    this.pickedObject = intersectedObjects;
                }
            }
        }
        PickOffObject() {
            let objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            for (let TYPE = JWFramework.ObjectType.OBJ_OBJECT3D; TYPE < JWFramework.ObjectType.OBJ_OBJECT2D; ++TYPE) {
                for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ) {
                    objectList[TYPE][OBJ].GameObject.Picked = false;
                }
            }
        }
        Pick() {
            let terrain;
            if (this.pickPositionX > 0.75 || this.pickPositionX == -1) {
                return;
            }
            this.PickOffObject();
            this.pickedObject = undefined;
            this.raycaster.setFromCamera({ x: this.pickPositionX, y: this.pickPositionY }, JWFramework.WorldManager.getInstance().MainCamera.CameraInstance);
            if (this.pickMode == JWFramework.PickMode.PICK_CLONE) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObjects(objectManager.GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].map(o_ => o_.GameObject.GameObjectInstance));
                if (intersectedObject[0] != undefined) {
                    let terrain = objectManager.GetObjectFromName(intersectedObject[0].object.name);
                    if (terrain != undefined && terrain.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName(JWFramework.GUIManager.getInstance().GUI_Select.GetSelectObjectName()));
                        cloneObject.GameObjectInstance.position.set(0, 0, 0);
                        let clonePosition = new THREE.Vector3(intersectedObject[0].point.x, intersectedObject[0].point.y + 10, intersectedObject[0].point.z);
                        cloneObject.GameObjectInstance.position.copy(clonePosition);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                }
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_TERRAIN) {
                JWFramework.GUIManager.getInstance().GUI_Terrain.SetTerrainOptionList();
                let heightOffset = JWFramework.GUIManager.getInstance().GUI_Terrain.GetHeightOffset();
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObjects(objectManager.GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].map(o_ => o_.GameObject.GameObjectInstance), true);
                if (intersectedObject[0] != undefined) {
                    terrain = objectManager.GetObjectFromName(intersectedObject[0].object.name);
                    if (terrain != null && terrain.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        terrain.SetHeight(intersectedObject[0].face.a, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                        terrain.SetHeight(intersectedObject[0].face.b, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                        terrain.SetHeight(intersectedObject[0].face.c, heightOffset, JWFramework.GUIManager.getInstance().GUI_Terrain.GetTerrainOption());
                    }
                }
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_DUMMYTERRAIN) {
                let objectManager = JWFramework.ObjectManager.getInstance();
                let intersectedObject = this.raycaster.intersectObjects(objectManager.GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].map(o_ => o_.GameObject.GameObjectInstance), true);
                if (intersectedObject[0] != undefined) {
                    terrain = objectManager.GetObjectFromName(intersectedObject[0].object.name);
                    if (terrain != null && terrain.Type == JWFramework.ObjectType.OBJ_TERRAIN) {
                        if (terrain.IsDummy == false)
                            terrain.IsDummy = true;
                    }
                }
            }
            else if (this.pickMode == JWFramework.PickMode.PICK_REMOVE) {
                let intersectedObjects = this.raycaster.intersectObjects(JWFramework.ObjectManager.getInstance().PickableObjectList.map(o_ => o_.GameObject.GameObjectInstance));
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    if (this.pickedParentName != undefined)
                        this.pickedParent.DeleteObject();
                }
            }
            else {
                let intersectedObjects = this.raycaster.intersectObjects(JWFramework.ObjectManager.getInstance().PickableObjectList.map(o_ => o_.GameObject.GameObjectInstance));
                if (intersectedObjects.length) {
                    this.GetParentName(intersectedObjects[0].object);
                    this.pickedParent = JWFramework.ObjectManager.getInstance().GetObjectFromName(this.pickedParentName);
                    if (this.pickedParentName != undefined && this.pickedParent != undefined) {
                        this.pickedParent.Picked = true;
                        JWFramework.GUIManager.getInstance().GUI_SRT.SetGameObject(this.pickedParent);
                    }
                    else
                        JWFramework.GUIManager.getInstance().GUI_SRT.SetGameObject(undefined);
                }
            }
        }
        GetCanvasReleativePosition(event) {
            let rect = JWFramework.WorldManager.getInstance().Canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) * JWFramework.WorldManager.getInstance().Canvas.width / rect.width,
                y: (event.clientY - rect.top) * JWFramework.WorldManager.getInstance().Canvas.height / rect.height,
            };
        }
        get MouseEvent() {
            return this.mouseEvent;
        }
        SetPickPosition(event) {
            this.pickPositionX = (event.clientX / window.innerWidth) * 2 - 1;
            this.pickPositionY = -(event.clientY / window.innerHeight) * 2 + 1;
            this.Pick();
        }
        ClearPickPosition() {
            this.pickPositionX = -10000;
            this.pickPositionY = -10000;
        }
        ChangePickModeModify() {
            this.pickMode = JWFramework.PickMode.PICK_MODIFY;
        }
        ChangePickModeClone() {
            this.pickMode = JWFramework.PickMode.PICK_CLONE;
        }
        ChangePickModeTerrain() {
            this.pickMode = JWFramework.PickMode.PICK_TERRAIN;
        }
        ChangePickModeDummyTerrain() {
            this.pickMode = JWFramework.PickMode.PICK_DUMMYTERRAIN;
        }
        ChangePickModeRemove() {
            this.pickMode = JWFramework.PickMode.PICK_REMOVE;
        }
        get PickMode() {
            return this.pickMode;
        }
        get OrbitControl() {
            return this.orbitControl;
        }
        get EnablePickOff() {
            return this.enablePickOff;
        }
        set EnablePickOff(value) {
            this.enablePickOff = value;
        }
        GetPickParents() {
            return this.pickedParent;
        }
    }
    JWFramework.Picker = Picker;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class SceneBase {
        constructor(sceneManager) {
            this.reloadScene = false;
            this.sceneManager = sceneManager;
            this.BuildSkyBox();
            this.BuildObject();
            this.BuildLight();
            this.BuildFog();
            this.SetPicker();
        }
        BuildSkyBox() { }
        BuildObject() { }
        BuildLight() { }
        BuildFog() { }
        Animate() { }
        get SceneManager() {
            return this.sceneManager;
        }
        get Picker() {
            return this.picker;
        }
        SetPicker() {
            this.picker = new JWFramework.Picker();
        }
        get NeedOnTerrain() {
            return this.needOnTerrain;
        }
        set NeedOnTerrain(flag) {
            this.needOnTerrain = flag;
        }
    }
    JWFramework.SceneBase = SceneBase;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class HeightmapTerrain extends JWFramework.GameObject {
        constructor(x, z, segmentWidth, segmentHeight, planSize = 900, isDummy = false) {
            super();
            this.heigtIndexBuffer = [];
            this.heigtBuffer = [];
            this.inSectorObject = [];
            this.vertexNormalNeedUpdate = false;
            this.opacity = 1;
            this.cityUVFactor = 1;
            this.row = 0;
            this.col = 0;
            this.isDummy = false;
            this.inSecter = false;
            this.cameraInSecter = false;
            this.useDirtTexture = false;
            this.useCityTexture = false;
            this.isDummy = isDummy;
            this.width = x;
            this.height = z;
            this.planSize = planSize;
            this.segmentWidth = segmentWidth;
            this.segmentHeight = segmentHeight;
            this.name = "Terrain" + JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].length;
            this.terrainIndex = JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].length;
            this.type = JWFramework.ObjectType.OBJ_TERRAIN;
            this.isClone = true;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.exportComponent = new JWFramework.ExportComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
            this.CreateTerrainMesh();
        }
        InitializeAfterLoad() {
            this.PhysicsComponent.SetPostion(this.width, 0, this.height);
            if (this.isDummy == false) {
                this.CreateBoundingBox();
            }
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.type);
        }
        CreateBoundingBox() {
            this.CollisionComponent.CreateBoundingBox(this.planSize, 5000, this.planSize);
            this.CollisionComponent.BoxHelper.box.setFromCenterAndSize(new THREE.Vector3(this.width, 2000, this.height), new THREE.Vector3(this.planSize, 5000, this.planSize));
            this.CollisionComponent.BoxHelper.visible = false;
        }
        CreateTerrainMesh() {
            if (this.isDummy == false)
                this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, this.segmentWidth, this.segmentHeight);
            else
                this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
            let customUniforms = {
                farmTexture: { type: "t", value: JWFramework.ShaderManager.getInstance().farmTexture },
                mountainTexture: { type: "t", value: JWFramework.ShaderManager.getInstance().mountainTexture },
                factoryTexture: { type: "t", value: JWFramework.ShaderManager.getInstance().factoryTexture },
                cityTexture: { type: "t", value: JWFramework.ShaderManager.getInstance().cityTexture },
                desertTexture: { type: "t", value: JWFramework.ShaderManager.getInstance().desertTexture },
                cityUVFactor: { type: "f", value: this.cityUVFactor },
                fogColor: { type: "c", value: THREE.UniformsLib['fog'].fogColor },
                fogDensity: { type: "f", value: THREE.UniformsLib['fog'].fogDensity },
                fogFar: { type: "f", value: THREE.UniformsLib['fog'].fogFar },
                fogNear: { type: "f", value: THREE.UniformsLib['fog'].fogNear },
                opacity: { type: "f", value: this.opacity }
            };
            this.material = new THREE.ShaderMaterial({
                uniforms: customUniforms,
                vertexShader: JWFramework.ShaderManager.getInstance().SplattingShader.vertexShader.slice(),
                fragmentShader: JWFramework.ShaderManager.getInstance().SplattingShader.fragmentShader.slice(),
                fog: true,
                transparent: false,
            });
            let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
            this.planeGeomatry.applyMatrix4(rotation);
            this.planeGeomatry.computeBoundingSphere();
            this.planeGeomatry.computeVertexNormals();
            this.planeMesh = new THREE.Mesh(this.planeGeomatry, this.material);
            this.planeMesh.receiveShadow = true;
            this.planeMesh.castShadow = true;
            this.gameObjectInstance = this.planeMesh;
            this.GameObjectInstance.name = this.name;
            this.gameObjectInstance.frustumCulled = true;
            this.InitializeAfterLoad();
        }
        get HeightIndexBuffer() {
            return this.heigtIndexBuffer;
        }
        get HeightBuffer() {
            for (let i = 0; i < this.heigtBuffer.length; ++i) {
                this.heigtBuffer.pop();
            }
            this.heigtBuffer.length = 0;
            this.heigtIndexBuffer.forEach(element => this.heigtBuffer.push(this.planeGeomatry.getAttribute('position').getY(element)));
            return this.heigtBuffer;
        }
        get IsDummy() {
            return this.isDummy;
        }
        set IsDummy(flag) {
            this.isDummy = flag;
        }
        SetHeight(index, value = undefined, option = JWFramework.TerrainOption.TERRAIN_UP) {
            if (this.isDummy == true) {
                if (this.collisionComponent.BoundingBox != null) {
                    this.collisionComponent.DeleteCollider();
                    this.planeGeomatry.dispose();
                    this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                    this.planeMesh.geometry = this.planeGeomatry;
                    let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                    this.planeGeomatry.applyMatrix4(rotation);
                }
            }
            this.planeGeomatry.getAttribute('position').needsUpdate = true;
            let height = this.planeGeomatry.getAttribute('position').getY(index);
            if (value != undefined && option == JWFramework.TerrainOption.TERRAIN_UP) {
                value = Math.abs(value);
            }
            if (option == JWFramework.TerrainOption.TERRAIN_DOWN) {
                value = Math.abs(value);
                value *= -1;
                this.planeGeomatry.getAttribute('position').setY(index, height += value);
            }
            else if (option == JWFramework.TerrainOption.TERRAIN_BALANCE || option == JWFramework.TerrainOption.TERRAIN_LOAD) {
                this.planeGeomatry.getAttribute('position').setY(index, value);
            }
            else {
                this.planeGeomatry.getAttribute('position').setY(index, height += value);
            }
            let objectList = JWFramework.ObjectManager.getInstance().GetObjectList;
            let endPointIndex = this.planeGeomatry.getAttribute('position').count - 1;
            let oldheight = this.planeGeomatry.getAttribute('position').getY(index);
            if (this.planeGeomatry.getAttribute('position').getX(index) == this.planSize / 2) {
                if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + 1]) {
                    let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + 1].GameObject;
                    terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                    terrain.planeGeomatry.getAttribute('position').setY(index - this.segmentHeight, oldheight);
                    if (index == endPointIndex) {
                        if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)]) {
                            let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row + 1)].GameObject;
                            terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                            terrain.planeGeomatry.getAttribute('position').setY(0, oldheight);
                        }
                    }
                    else if (index == this.segmentWidth) {
                        if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)]) {
                            let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row - 1)].GameObject;
                            terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                            terrain.planeGeomatry.getAttribute('position').setY(endPointIndex - this.segmentWidth, oldheight);
                        }
                    }
                }
            }
            if (this.planeGeomatry.getAttribute('position').getX(index) == -(this.planSize / 2)) {
                if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - 1]) {
                    let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - 1].GameObject;
                    terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                    terrain.planeGeomatry.getAttribute('position').setY(index + this.segmentHeight, oldheight);
                }
                if (index == 0) {
                    if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)]) {
                        let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - (this.row + 1)].GameObject;
                        terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                        terrain.planeGeomatry.getAttribute('position').setY(endPointIndex, oldheight);
                    }
                }
                else if (index == endPointIndex - this.segmentWidth) {
                    if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)]) {
                        let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + (this.row - 1)].GameObject;
                        terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                        terrain.planeGeomatry.getAttribute('position').setY(this.segmentWidth, oldheight);
                    }
                }
            }
            if (this.planeGeomatry.getAttribute('position').getZ(index) == this.planSize / 2) {
                if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col]) {
                    let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex + this.col].GameObject;
                    terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                    terrain.planeGeomatry.getAttribute('position').setY(index - (endPointIndex - this.segmentWidth), oldheight);
                }
            }
            if (this.planeGeomatry.getAttribute('position').getZ(index) == -(this.planSize / 2)) {
                if (objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col]) {
                    let terrain = objectList[JWFramework.ObjectType.OBJ_TERRAIN][this.terrainIndex - this.col].GameObject;
                    terrain.planeGeomatry.getAttribute('position').needsUpdate = true;
                    terrain.planeGeomatry.getAttribute('position').setY(index + (endPointIndex - this.segmentWidth), oldheight);
                }
            }
            if (this.heigtIndexBuffer.indexOf(index) == -1)
                this.heigtIndexBuffer.push(index);
            this.vertexNormalNeedUpdate = true;
            let positionLength = this.planeGeomatry.getAttribute('position').count;
            let cnt = 0;
            for (let i = 0; i < positionLength; ++i) {
                if (this.planeGeomatry.getAttribute('position').getY(i) <= -3) {
                    this.useDirtTexture = true;
                }
                else if (i == positionLength - 1 && !this.useDirtTexture)
                    this.useDirtTexture = false;
                if (this.planeGeomatry.getAttribute('position').getY(i) == 1)
                    ++cnt;
                if (cnt >= 30 && this.physicsComponent.GetMaxVertex().y <= 110) {
                    this.useCityTexture = true;
                    this.material.uniforms.cityUVFactor.value = 6;
                }
                else {
                    this.useCityTexture = false;
                    this.material.uniforms.cityUVFactor.value = 1;
                }
            }
        }
        CollisionActive(object) {
            if (this.isDummy == false) {
                if (object.Type == JWFramework.ObjectType.OBJ_CAMERA) {
                    this.cameraInSecter = false;
                }
                else {
                    if (this.inSectorObject.includes(object) == false) {
                        this.inSectorObject.push(object);
                        this.inSecter = true;
                    }
                }
            }
        }
        CollisionDeActive(object) {
            if (object.Type == JWFramework.ObjectType.OBJ_CAMERA) {
                this.cameraInSecter = false;
            }
            else {
                if (this.inSectorObject.includes(object) == true) {
                    this.inSectorObject = this.inSectorObject.filter((element) => (element != object)).slice();
                }
            }
        }
        Animate() {
            if (this.isDummy == true) {
                if (this.collisionComponent.BoundingBox != null) {
                    this.collisionComponent.DeleteCollider();
                    this.planeGeomatry.dispose();
                    this.planeGeomatry = new THREE.PlaneGeometry(this.planSize, this.planSize, 1, 1);
                    this.planeMesh.geometry = this.planeGeomatry;
                    let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
                    this.planeGeomatry.applyMatrix4(rotation);
                }
            }
            else {
                if (this.useDirtTexture)
                    this.material.uniforms.factoryTexture.value = JWFramework.ShaderManager.getInstance().desertTexture;
                else
                    this.material.uniforms.factoryTexture.value = JWFramework.ShaderManager.getInstance().factoryTexture;
                if (this.useCityTexture)
                    this.material.uniforms.cityTexture.value = JWFramework.ShaderManager.getInstance().cityTexture;
                else
                    this.material.uniforms.cityTexture.value = JWFramework.ShaderManager.getInstance().farmTexture;
                if (this.collisionComponent.BoundingBox == null)
                    this.CreateBoundingBox();
            }
            if (this.vertexNormalNeedUpdate) {
                this.planeGeomatry.computeVertexNormals();
                this.vertexNormalNeedUpdate = false;
            }
            this.inSectorObject = this.inSectorObject.filter((element) => (element.IsDead == false));
            if (this.inSectorObject.length == 0) {
                this.inSecter = false;
            }
        }
    }
    JWFramework.HeightmapTerrain = HeightmapTerrain;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Cloud extends JWFramework.GameObject {
        constructor() {
            super();
            this.positions = [];
            this.scales = [];
            this.prevMatrix = [];
            this.type = JWFramework.ObjectType.OBJ_OBJECT2D;
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.isClone = false;
        }
        BuildClouds() {
            this.CreateBillboardMesh();
        }
        InitializeAfterLoad() {
            if (this.IsClone == true) {
                this.BuildClouds();
                this.GameObjectInstance.matrixAutoUpdate = true;
                this.GameObjectInstance.name = this.name;
            }
            else {
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            }
        }
        SetMaterial(mesh) {
            (mesh).traverse(node => {
                if (node.isMesh || node.isGroup || node.isSprite) {
                    node.name = "CloudCloneNode";
                    if (node.geometry) {
                        node.material.color = new THREE.Color(0.45, 0.45, 0.45);
                        node.material.fog = false;
                        node.material.transparent = true;
                        node.material.opacity = 0.9;
                        node.material.alphaTest = 0.01;
                        node.material.depthWrite = false;
                        node.material.side = THREE.DoubleSide;
                    }
                    ;
                }
            });
        }
        CreateBillboardMesh() {
            this.mesh = new THREE.Mesh();
            const positions = [];
            for (let i = 0; i < 30; ++i) {
                const scale = new THREE.Vector3(1000 + Math.random() * 1600, 500 + Math.random() * 1000, 1000 + Math.random() * 1600);
                const position = new THREE.Vector3();
                do {
                    position.set(-10000 + Math.random() * 20000, 200 + Math.random() * 600, -5000 + Math.random() * 20000);
                } while (positions.some(p => p.distanceTo(position) < Math.max(scale.x, scale.z)));
                let childMesh = JWFramework.ObjectManager.getInstance().GetObjectFromName("Cloud").GameObjectInstance.clone();
                childMesh.name = "CloudCloneChild";
                this.SetMaterial(childMesh);
                childMesh.position.set(position.x, position.y, position.z);
                childMesh.scale.set(scale.x, scale.y, scale.z);
                childMesh.rotateY(Math.random() * 360);
                childMesh.renderOrder = -1;
                this.mesh.add(childMesh);
                positions.push(position);
            }
            this.mesh.name = "CloudCloneMesh";
            this.GameObjectInstance = this.mesh;
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
        Animate() {
        }
    }
    JWFramework.Cloud = Cloud;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ModelLoadManager {
        constructor() {
            this.loadComplete = false;
            this.terrain = [];
            this.loaderManager = new THREE.LoadingManager;
            this.loaderManager.onLoad = this.SetLoadComplete;
            this.gltfLoader = new THREE.GLTFLoader(this.loaderManager);
            this.loadCompletModel = 0;
        }
        static getInstance() {
            if (!ModelLoadManager.instance) {
                ModelLoadManager.instance = new ModelLoadManager;
            }
            return ModelLoadManager.instance;
        }
        SetLoadComplete() {
            this.loadCompletModel++;
            if (this.loadCompletModel == this.modelCount)
                this.LoadComplete = true;
        }
        set LoadComplete(flag) {
            this.loadComplete = flag;
        }
        get LoadComplete() {
            if (this.loadComplete == true && JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                JWFramework.GUIManager.getInstance().GUI_Select;
            }
            return this.loadComplete;
        }
        LoadScene() {
            if (JWFramework.SceneManager.getInstance().SceneType == JWFramework.SceneType.SCENE_EDIT) {
                this.modeltList = JWFramework.ModelSceneBase.getInstance("ModelSceneEdit").ModelScene;
                this.modelCount = JWFramework.ModelSceneBase.getInstance("ModelSceneEdit").ModelNumber;
            }
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain(20, 20);
        }
        LoadSceneStage() {
            this.modeltList = JWFramework.ModelSceneStage.getInstance().ModelScene;
            this.modelCount = JWFramework.ModelSceneStage.getInstance().ModelNumber;
            for (let i = 0; i < this.modeltList.length; ++i) {
                this.LoadModel(this.modeltList[i].url, this.modeltList[i].model);
            }
            this.LoadHeightmapTerrain();
        }
        LoadModel(modelSource, gameObject) {
            if (modelSource != null) {
                this.gltfLoader.load(modelSource, (gltf) => {
                    console.log('success');
                    gameObject.ModelData = gltf;
                    gltf.scene.traverse(n => {
                        if (n.isMesh) {
                            let texture = n.material.map;
                            let normal = n.material.normalMap;
                            let opacity = n.material.opacity;
                            let color = n.material.color;
                            let side = n.material.side;
                            let roughness = n.material.roughness;
                            let metalness = n.material.metalness;
                            n.material.map = texture;
                            n.material.normalMap = normal;
                            n.material.color = color;
                            n.material.roughness = roughness;
                            n.material.metalness = metalness;
                            n.material.envMap = JWFramework.SceneManager.getInstance().SceneInstance.environment;
                            n.castShadow = true;
                            n.receiveShadow = true;
                            if (opacity != 1) {
                                n.material.opacity = opacity;
                            }
                            n.material.side = side;
                        }
                    });
                    gameObject.GameObjectInstance = gltf.scene;
                    gameObject.InitializeAfterLoad();
                    this.SetLoadComplete();
                }, (progress) => {
                    console.log('progress');
                    console.log(progress);
                }, (error) => {
                    console.log('error');
                    console.log(error);
                });
            }
            else {
                gameObject.InitializeAfterLoad();
                this.SetLoadComplete();
            }
        }
        LoadHeightmapTerrain(row = 20, col = 20) {
            let terrainIndex = 0;
            for (let i = 0; i < col; ++i) {
                for (let j = 0; j < row; ++j) {
                    let terrainX = j * 900;
                    let terrainY = i * 900;
                    let terrainWidth = 16;
                    let terrainHeight = 16;
                    if (i == 0 || i == col - 1 || j == 0 || j == row - 1)
                        this.terrain[terrainIndex] = new JWFramework.HeightmapTerrain(terrainX, terrainY, terrainWidth, terrainHeight, 900, true);
                    else
                        this.terrain[terrainIndex] = new JWFramework.HeightmapTerrain(terrainX, terrainY, terrainWidth, terrainHeight, 900, false);
                    this.terrain[terrainIndex].row = row;
                    this.terrain[terrainIndex].col = col;
                    terrainIndex++;
                }
            }
        }
        LoadSavedScene() {
            fetch("./Model/Scene.json")
                .then(response => {
                return response.json();
            })
                .then(jsondata => {
                let objectManager = JWFramework.ObjectManager.getInstance();
                for (let data of jsondata) {
                    if (data.name.includes("Terrain")) {
                        let terrain = objectManager.GetObjectFromName(data.name);
                        if (data.isDummy != undefined)
                            terrain.IsDummy = data.isDummy;
                        for (let i = 0; i < data.vertexIndex.length; ++i) {
                            terrain.SetHeight(data.vertexIndex[i], data.vertexHeight[i], JWFramework.TerrainOption.TERRAIN_LOAD);
                        }
                    }
                    else if (data.name.includes("MIG_29")) {
                        let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("MIG_29"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                        if (data.obbSize != null)
                            cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("F-5E")) {
                        let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("F-5E"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                        cloneObject.CollisionComponent.HalfSize = new THREE.Vector3(data.obbSize.x, data.obbSize.y, data.obbSize.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("Water")) {
                        let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("Water"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                    else if (data.name.includes("AIM-9")) {
                        let cloneObject = objectManager.MakeClone(objectManager.GetObjectFromName("AIM-9"));
                        cloneObject.PhysicsComponent.SetScale(data.scale.x, data.scale.y, data.scale.z);
                        cloneObject.PhysicsComponent.SetRotate(data.rotation.x, data.rotation.y, data.rotation.z);
                        cloneObject.PhysicsComponent.SetPostion(data.position.x, data.position.y, data.position.z);
                        objectManager.AddObject(cloneObject, cloneObject.Name, cloneObject.Type);
                    }
                }
            });
        }
    }
    JWFramework.ModelLoadManager = ModelLoadManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class Light extends JWFramework.GameObject {
        constructor(type) {
            super();
            this.type = JWFramework.ObjectType.OBJ_LIGHT;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.isClone = true;
            this.color = 0x000000;
            this.intensity = 0;
            if (type == JWFramework.LightType.LIGHT_DIRECTIONAL)
                this.light = new THREE.DirectionalLight(this.color, this.intensity);
            else if (type == JWFramework.LightType.LIGHT_AMBIENT)
                this.light = new THREE.AmbientLight(this.color, this.intensity);
            this.GameObjectInstance = this.light;
        }
        get Color() {
            return this.color;
        }
        SetColor(color) {
            this.color = color;
            this.SetLightElement();
        }
        get Intensity() {
            return this.intensity;
        }
        set Intensity(intensity) {
            this.intensity = intensity;
            this.SetLightElement();
        }
        SetLightElement() {
            this.light.color.set(this.color);
            this.light.intensity = this.intensity;
            if (this.light instanceof THREE.DirectionalLight) {
                this.light.target.position.set(0, 0, 0);
            }
        }
    }
    JWFramework.Light = Light;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class EditScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super(sceneManager);
            this.makedCloud = false;
            this.gizmoOnOff = true;
        }
        BuildSkyBox() {
            this.SceneManager.SceneInstance.background = new THREE.CubeTextureLoader()
                .setPath('Model/SkyBox/')
                .load([
                'Right.bmp',
                'Left.bmp',
                'Up.bmp',
                'Down.bmp',
                'Front.bmp',
                'Back.bmp'
            ]);
            this.SceneManager.SceneInstance.environment = this.SceneManager.SceneInstance.background;
        }
        BuildObject() {
            JWFramework.ModelLoadManager.getInstance().LoadScene();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.directionalLight = new JWFramework.Light(JWFramework.LightType.LIGHT_DIRECTIONAL);
            JWFramework.ObjectManager.getInstance().AddObject(this.directionalLight, "directionalLight", this.directionalLight.Type);
            this.directionalLight.SetColor(0xFFFFFF);
            this.directionalLight.Intensity = 0.6;
            this.directionalLight.PhysicsComponent.SetPostionVec3(new THREE.Vector3(1, 1, 0));
            this.ambientLight = new JWFramework.Light(JWFramework.LightType.LIGHT_AMBIENT);
            JWFramework.ObjectManager.getInstance().AddObject(this.ambientLight, "ambientlLight", this.ambientLight.Type);
            this.ambientLight.SetColor(0xFFFFFF);
            this.ambientLight.Intensity = 0.5;
        }
        BuildFog() {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 300, 2900);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                this.MakeGizmo();
                this.MakeSceneCloud();
                JWFramework.ObjectManager.getInstance().Animate();
                this.InputProcess();
                this.ReloadProcess();
            }
        }
        MakeGizmo() {
            if (this.gizmo == null) {
                let worldManager = JWFramework.WorldManager.getInstance();
                this.gizmo = new THREE.TransformControls(worldManager.MainCamera.CameraInstance, worldManager.Renderer.domElement);
                this.gizmo.addEventListener('dragging-changed', function (event) {
                    JWFramework.SceneManager.getInstance().CurrentScene.Picker.OrbitControl.enabled = !event.value;
                    JWFramework.SceneManager.getInstance().CurrentScene.Picker.EnablePickOff = false;
                });
                this.sceneManager.SceneInstance.add(this.gizmo);
            }
        }
        AttachGizmo(gameObject) {
            if (this.gizmoOnOff)
                this.gizmo.attach(gameObject.GameObjectInstance);
        }
        DetachGizmo(gameObject) {
            if (this.gizmo.object == gameObject.GameObjectInstance)
                this.gizmo.detach();
        }
        get GizmoOnOff() {
            return this.gizmoOnOff;
        }
        MakeSceneCloud() {
            if (this.makedCloud == false) {
                for (let i = 0; i < 30; ++i) {
                    let lowCloud = new JWFramework.LowCloud();
                    lowCloud.IsClone = true;
                    let x = -5000 + Math.random() * 20000;
                    let y = 200 + Math.random() * 200;
                    let z = -5000 + Math.random() * 20000;
                    lowCloud.BuildClouds(x, y, z);
                }
                this.makedCloud = true;
            }
        }
        InputProcess() {
            let inputManager = JWFramework.InputManager.getInstance();
            let sceneManager = JWFramework.SceneManager.getInstance();
            if (inputManager.GetKeyState('1', JWFramework.KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeModify();
            }
            if (inputManager.GetKeyState('2', JWFramework.KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeClone();
            }
            if (sceneManager.CurrentScene.Picker.PickMode == JWFramework.PickMode.PICK_CLONE) {
                if (inputManager.GetKeyState('t', JWFramework.KeyState.KEY_PRESS))
                    this.Picker.SetPickPosition(this.Picker.MouseEvent);
            }
            if (inputManager.GetKeyState('3', JWFramework.KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeTerrain();
            }
            if (inputManager.GetKeyState('4', JWFramework.KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeRemove();
            }
            if (inputManager.GetKeyState('6', JWFramework.KeyState.KEY_DOWN)) {
                this.Picker.ChangePickModeDummyTerrain();
            }
            if (inputManager.GetKeyState('q', JWFramework.KeyState.KEY_DOWN)) {
                this.gizmoOnOff = !this.gizmoOnOff;
                if (this.gizmoOnOff == false && this.Picker.GetPickParents() != null)
                    this.DetachGizmo(this.Picker.GetPickParents());
            }
            if (inputManager.GetKeyState('w', JWFramework.KeyState.KEY_DOWN)) {
                this.gizmo.setMode("translate");
            }
            if (inputManager.GetKeyState('e', JWFramework.KeyState.KEY_DOWN)) {
                this.gizmo.setMode("rotate");
            }
            if (inputManager.GetKeyState('r', JWFramework.KeyState.KEY_DOWN)) {
                this.gizmo.setMode("scale");
            }
            if (inputManager.GetKeyState('o', JWFramework.KeyState.KEY_DOWN)) {
                JWFramework.GUIManager.getInstance().GUI_Terrain.ChangeTerrainOption();
            }
            if (sceneManager.CurrentScene.Picker.PickMode == JWFramework.PickMode.PICK_TERRAIN ||
                sceneManager.CurrentScene.Picker.PickMode == JWFramework.PickMode.PICK_DUMMYTERRAIN)
                if (inputManager.GetKeyState('t', JWFramework.KeyState.KEY_PRESS))
                    this.Picker.SetPickPosition(this.Picker.MouseEvent);
            if (inputManager.GetKeyState('u', JWFramework.KeyState.KEY_PRESS)) {
                sceneManager.CurrentScene.NeedOnTerrain = true;
                JWFramework.GUIManager.getInstance().GUI_Terrain.ChangeHeightOffset();
            }
            else
                sceneManager.CurrentScene.NeedOnTerrain = false;
            if (inputManager.GetKeyState('delete', JWFramework.KeyState.KEY_DOWN)) {
                JWFramework.ObjectManager.getInstance().DeleteAllObject();
                this.gizmo.detach();
                this.sceneManager.SceneInstance.remove(this.gizmo);
                this.reloadScene = true;
            }
            if (inputManager.GetKeyState('p', JWFramework.KeyState.KEY_PRESS)) {
                console.log(JWFramework.WorldManager.getInstance().Renderer.info);
            }
        }
        ReloadProcess() {
            if (this.reloadScene) {
                if (JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_TERRAIN].length == 0) {
                    JWFramework.ModelLoadManager.getInstance().LoadHeightmapTerrain();
                    JWFramework.ModelLoadManager.getInstance().LoadSavedScene();
                    JWFramework.WorldManager.getInstance().Renderer.clear();
                    this.BuildLight();
                    this.gizmo.dispose();
                    this.gizmo = null;
                    this.makedCloud = false;
                    this.reloadScene = false;
                }
            }
        }
    }
    JWFramework.EditScene = EditScene;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class SceneManager {
        constructor() { }
        static getInstance() {
            if (!SceneManager.instance) {
                SceneManager.instance = new SceneManager;
            }
            return SceneManager.instance;
        }
        get SceneInstance() {
            return this.sceneThree;
        }
        get CurrentScene() {
            return this.scene;
        }
        get SceneType() {
            return this.sceneType;
        }
        MakeJSON() {
            JWFramework.ObjectManager.getInstance().MakeJSONArray();
        }
        BuildScene() {
            this.sceneThree = new THREE.Scene();
            this.sceneType = JWFramework.SceneType.SCENE_EDIT;
            this.objectManager = JWFramework.ObjectManager.getInstance();
            switch (this.sceneType) {
                case JWFramework.SceneType.SCENE_EDIT:
                    this.scene = new JWFramework.EditScene(this);
                    break;
                case JWFramework.SceneType.SCENE_START:
                    break;
                case JWFramework.SceneType.SCENE_STAGE:
                    break;
            }
        }
        Animate() {
            this.scene.Animate();
        }
    }
    JWFramework.SceneManager = SceneManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class SplattingShader {
        constructor() {
            this.vertexShader =
                `
         #include <fog_pars_vertex>
         varying vec2 vUV;
         varying vec4 Position;

         void main() {
            #include <begin_vertex>
            #include <project_vertex>
            #include <fog_vertex>
            vUV = uv;
            Position = vec4(position,1.0);
           }
         `;
            this.fragmentShader =
                `
         #include <fog_pars_fragment>

         uniform sampler2D farmTexture;
         uniform sampler2D mountainTexture;
         uniform sampler2D factoryTexture;
         uniform sampler2D cityTexture;
         uniform sampler2D desertTexture;
         uniform float opacity;
         uniform float cityUVFactor;

         varying vec2 vUV;
         varying vec4 Position;

         void main() 
         {
            vec4 factory = vec4(0.0);
            vec4 farm = vec4(0.0);
            vec4 city = vec4(0.0);
            vec4 mountain = vec4(0.0);
            vec4 desert = vec4(0.0);

            factory = (smoothstep(-2.f, -1.f, Position.y) - smoothstep(-1.f, 0.f, Position.y)) * texture2D( factoryTexture, vUV * 9.5 );
            factory[3] = 0.0;
            farm = (smoothstep(-1.f, 0.f, Position.y) - smoothstep(0.f, 1.f, Position.y)) * texture2D( farmTexture, vUV * 1.0 );
            farm[3] = 0.0;
            city = (smoothstep(0.f, 1.f, Position.y) - smoothstep(1.f, 2.f, Position.y)) * texture2D( cityTexture, vUV * cityUVFactor );
            city[3] = 0.0;
            mountain = (smoothstep(1.f, 2.f, Position.y) - smoothstep(2.f, 1200.f, Position.y)) * texture2D( mountainTexture, vUV * 5.0);
            mountain[3] = 0.0;
            desert = (smoothstep(-1.f, -2.f, Position.y) - smoothstep(-2.f, -1200.f, Position.y)) * texture2D( desertTexture, vUV * 10.0 );
            desert[3] = 0.0;

            gl_FragColor = vec4(0.0, 0.0, 0.0, opacity) + farm + mountain + factory + city + desert;

            #include <fog_fragment>
         }  
         `;
        }
    }
    JWFramework.SplattingShader = SplattingShader;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ShaderManager {
        constructor() {
            this.BuildMotuinBlurShader();
            this.splattingShader = new JWFramework.SplattingShader();
            this.farmTexture = new THREE.TextureLoader().load("Model/Heightmap/farm.jpg");
            this.farmTexture.wrapS = THREE.RepeatWrapping;
            this.farmTexture.wrapT = THREE.RepeatWrapping;
            this.mountainTexture = new THREE.TextureLoader().load("Model/Heightmap/mountain.jpg");
            this.mountainTexture.wrapS = THREE.RepeatWrapping;
            this.mountainTexture.wrapT = THREE.RepeatWrapping;
            this.factoryTexture = new THREE.TextureLoader().load("Model/Heightmap/factory.jpg");
            this.factoryTexture.wrapS = THREE.RepeatWrapping;
            this.factoryTexture.wrapT = THREE.RepeatWrapping;
            this.cityTexture = new THREE.TextureLoader().load("Model/Heightmap/city.jpg");
            this.cityTexture.wrapS = THREE.RepeatWrapping;
            this.cityTexture.wrapT = THREE.RepeatWrapping;
            this.desertTexture = new THREE.TextureLoader().load("Model/Heightmap/desert.jpg");
            this.desertTexture.wrapS = THREE.RepeatWrapping;
            this.desertTexture.wrapT = THREE.RepeatWrapping;
            this.fogTexture = new THREE.TextureLoader().load("Model/fog/fog.png");
            this.fogTexture.wrapS = THREE.RepeatWrapping;
            this.fogTexture.wrapT = THREE.RepeatWrapping;
            this.cloudTexture = new THREE.TextureLoader().load("Model/Cloud/cloud3.png");
            this.cloudTexture.wrapS = THREE.RepeatWrapping;
            this.cloudTexture.wrapT = THREE.RepeatWrapping;
            this.missileFlameTexture = new THREE.TextureLoader().load("Model/MissileFlame/MissileFlame.png");
            this.missileFlameTexture.wrapS = THREE.RepeatWrapping;
            this.missileFlameTexture.wrapT = THREE.RepeatWrapping;
        }
        static getInstance() {
            if (!ShaderManager.instance) {
                ShaderManager.instance = new ShaderManager;
            }
            return ShaderManager.instance;
        }
        BuildMotuinBlurShader() {
            let renderer = JWFramework.WorldManager.getInstance().Renderer;
            let sceneInstance = JWFramework.SceneManager.getInstance().SceneInstance;
            let camera = JWFramework.WorldManager.getInstance().MainCamera.CameraInstance;
            let canvas = JWFramework.WorldManager.getInstance().Canvas;
            this.composer = new THREE.EffectComposer(renderer);
            this.renderPass = new THREE.RenderPass(sceneInstance, camera);
            this.renderTargetParameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                stencilBuffer: false
            };
            this.savePass = new THREE.SavePass(new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, this.renderTargetParameters));
            this.blendPass = new THREE.ShaderPass(THREE.BlendShader, "tDiffuse1");
            this.blendPass.uniforms["tDiffuse2"].value = this.savePass.renderTarget.texture;
            this.blendPass.uniforms["mixRatio"].value = 0.0;
            this.outputPass = new THREE.ShaderPass(THREE.CopyShader);
            this.composer.addPass(this.renderPass);
            this.composer.addPass(this.blendPass);
            this.composer.addPass(this.savePass);
            this.composer.addPass(this.outputPass);
            this.composer.renderToScreen = true;
        }
        get SplattingShader() {
            return this.splattingShader;
        }
        ShadedRender() {
            this.composer.render();
        }
    }
    JWFramework.ShaderManager = ShaderManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class WorldManager {
        constructor() { }
        static getInstance() {
            if (!WorldManager.instance) {
                WorldManager.instance = new WorldManager;
            }
            return WorldManager.instance;
        }
        InitializeWorld() {
            this.CreateRendere();
            this.ResizeView();
            this.CreateMainCamera();
            this.CreateScene();
            this.CreateDeltaTime();
            this.renderer.compile(JWFramework.SceneManager.getInstance().SceneInstance, this.camera.CameraInstance);
            WorldManager.getInstance().Renderer.initTexture(JWFramework.ShaderManager.getInstance().farmTexture);
            WorldManager.getInstance().Renderer.initTexture(JWFramework.ShaderManager.getInstance().mountainTexture);
            WorldManager.getInstance().Renderer.initTexture(JWFramework.ShaderManager.getInstance().factoryTexture);
            WorldManager.getInstance().Renderer.initTexture(JWFramework.ShaderManager.getInstance().fogTexture);
        }
        CreateRendere() {
            this.renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector("#c"),
                alpha: true,
                antialias: true,
                precision: "highp",
                premultipliedAlpha: true,
                stencil: true,
                preserveDrawingBuffer: false,
                logarithmicDepthBuffer: false,
            });
            this.renderer.setViewport(0, 0, JWFramework.Define.SCREEN_WIDTH, JWFramework.Define.SCREEN_HEIGHT);
            this.renderer.setScissor(0, 0, 0, 0);
            this.renderer.setClearColor(0x000000);
            this.renderer.shadowMap.enabled = true;
            this.renderer.autoClearStencil = true;
            console.log("is webgl2?: ", this.renderer.capabilities.isWebGL2);
            document.body.appendChild(this.renderer.domElement);
        }
        ResizeView() {
            const width = this.Canvas.clientWidth;
            const height = this.Canvas.clientHeight;
            const needResize = this.Canvas.width !== width || this.Canvas.height !== height;
            if (needResize) {
                this.renderer.setSize(width, height, false);
            }
            return needResize;
        }
        CreateMainCamera() {
            this.camera = new JWFramework.Camera();
            this.camera.Name = "MainCamera";
            this.camera.Fov = 75;
            this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
            this.camera.Near = 0.1;
            this.camera.Far = 10000;
            this.camera.PhysicsComponent.SetPostion(0, 22, 0);
            JWFramework.ObjectManager.getInstance().AddObject(this.camera, this.camera.Name, this.camera.Type);
        }
        CreateScene() {
            this.sceneManager = JWFramework.SceneManager.getInstance();
            this.sceneManager.BuildScene();
        }
        CreateDeltaTime() {
            this.clock = new THREE.Clock();
            this.delta = 0;
        }
        GetDeltaTime() {
            return this.delta;
        }
        get Canvas() {
            return this.renderer.domElement;
        }
        get MainCamera() {
            return this.camera;
        }
        get Renderer() {
            return this.renderer;
        }
        Animate() {
            if (this.ResizeView()) {
                this.camera.Aspect = this.Canvas.clientWidth / this.Canvas.clientHeight;
                this.camera.CameraInstance.updateProjectionMatrix();
            }
            this.delta = this.clock.getDelta();
            this.MainCamera.Animate();
            this.sceneManager.Animate();
        }
        Render() {
            this.renderer.render(this.sceneManager.SceneInstance, this.camera.CameraInstance);
        }
    }
    JWFramework.WorldManager = WorldManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class UnitConvertManager {
        static getInstance() {
            if (!UnitConvertManager.instance) {
                UnitConvertManager.instance = new UnitConvertManager;
            }
            return UnitConvertManager.instance;
        }
        ConvertToSpeedForKmh(distance) {
            let meterDistance = (distance * 5760) / 900;
            let timeInSeconds = JWFramework.WorldManager.getInstance().GetDeltaTime();
            let speedInMeterPerSecond = meterDistance / timeInSeconds;
            speedInMeterPerSecond = speedInMeterPerSecond * 3.6;
            return Math.round(speedInMeterPerSecond);
        }
        ConvertToDistance(distance) {
            let meterDistance = (distance * 5760) / 900;
            return meterDistance;
        }
    }
    JWFramework.UnitConvertManager = UnitConvertManager;
})(JWFramework || (JWFramework = {}));
{
    const worldManager = JWFramework.WorldManager.getInstance();
    worldManager.InitializeWorld();
    let stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.top = "450px";
    stats.dom.style.left = "5px";
    document.body.appendChild(stats.dom);
    const main = function () {
        stats.begin();
        worldManager.Animate();
        worldManager.Render();
        stats.end();
        requestAnimationFrame(main);
    };
    main();
}
var JWFramework;
(function (JWFramework) {
    class CollisionManager {
        static getInstance() {
            if (!CollisionManager.instance) {
                CollisionManager.instance = new CollisionManager;
            }
            return CollisionManager.instance;
        }
        CollideRayToTerrain(sorce) {
            sorce.forEach(function (src) {
                let destination = src.GameObject.inSectorObject;
                destination.forEach(function (dst) {
                    if (dst.CollisionComponent != null && dst.CollisionComponent.Raycaster != null)
                        if ((src.GameObject != undefined && dst.IsClone == true && dst.IsRayOn == true) || JWFramework.SceneManager.getInstance().CurrentScene.NeedOnTerrain == true) {
                            let intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                            if (intersect[0] != undefined) {
                                if (intersect[0].distance < 1) {
                                    dst.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                    if (dst instanceof JWFramework.Missile)
                                        dst.CollisionActive(JWFramework.ObjectType.OBJ_TERRAIN);
                                }
                            }
                            else {
                                dst.CollisionComponent.Raycaster.set(new THREE.Vector3(dst.PhysicsComponent.GetPosition().x, 2000, dst.PhysicsComponent.GetPosition().z), new THREE.Vector3(0, -1, 0));
                                let intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                                if (intersect[0] != undefined) {
                                    dst.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                }
                                dst.CollisionComponent.Raycaster.set(dst.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
                            }
                        }
                });
            });
        }
        CollideRayToWater(sorce) {
            sorce.forEach(function (src) {
                let destination = JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT3D].filter(o_ => o_.GameObject.IsClone).map(o_ => o_.GameObject);
                destination.forEach(function (dst) {
                    if (dst.CollisionComponent != null && dst.CollisionComponent.Raycaster != null)
                        if ((src.GameObject != undefined && dst.IsRayOn == true) || JWFramework.SceneManager.getInstance().CurrentScene.NeedOnTerrain == true) {
                            let intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                            if (intersect[0] != undefined) {
                                if (intersect[0].distance < 1) {
                                    dst.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                    if (dst instanceof JWFramework.Missile)
                                        dst.CollisionActive(JWFramework.ObjectType.OBJ_TERRAIN);
                                }
                            }
                            else {
                                dst.CollisionComponent.Raycaster.set(new THREE.Vector3(dst.PhysicsComponent.GetPosition().x, 2000, dst.PhysicsComponent.GetPosition().z), new THREE.Vector3(0, -1, 0));
                                let intersect = dst.CollisionComponent.Raycaster.intersectObject(src.GameObject.GameObjectInstance);
                                if (intersect[0] != undefined) {
                                    dst.PhysicsComponent.SetPostion(intersect[0].point.x, intersect[0].point.y + 1, intersect[0].point.z);
                                }
                                dst.CollisionComponent.Raycaster.set(dst.PhysicsComponent.GetPosition(), new THREE.Vector3(0, -1, 0));
                            }
                        }
                });
            });
        }
        CollideBoxToBox(sorce, destination) {
            sorce.forEach(function (src) {
                destination.forEach(function (dst) {
                    if (src.GameObject.IsClone && dst.GameObject.IsClone) {
                        if ((src.GameObject != dst.GameObject) && src.GameObject.CollisionComponent.BoxHelper.box && dst.GameObject.CollisionComponent.BoxHelper.box) {
                            if (src.GameObject.CollisionComponent.BoxHelper.box.intersectsBox(dst.GameObject.CollisionComponent.BoxHelper.box)) {
                                src.GameObject.CollisionActive(dst.GameObject);
                                dst.GameObject.CollisionActive();
                            }
                            else {
                                src.GameObject.CollisionDeActive(dst.GameObject);
                                dst.GameObject.CollisionDeActive();
                            }
                        }
                    }
                });
            });
        }
        CollideObbToObb(sorce, destination) {
            sorce.forEach(function (src) {
                destination.forEach(function (dst) {
                    if (src.IsClone && dst.IsClone) {
                        if (src != dst) {
                            if (src.CollisionComponent != null && dst.CollisionComponent != null)
                                if (src.CollisionComponent.OBB && dst.CollisionComponent.OBB)
                                    if (src.CollisionComponent.OBB.intersectsOBB(dst.CollisionComponent.OBB)) {
                                        if (!(dst.GameObject instanceof JWFramework.HeightmapTerrain) || !(src.GameObject instanceof JWFramework.HeightmapTerrain)) {
                                            src.CollisionActive(dst.Type);
                                        }
                                        dst.CollisionActive();
                                    }
                                    else {
                                        if (!(dst.GameObject instanceof JWFramework.HeightmapTerrain) || !(src.GameObject instanceof JWFramework.HeightmapTerrain))
                                            src.CollisionDeActive(dst.Type);
                                        dst.CollisionDeActive();
                                    }
                        }
                    }
                });
            });
        }
        CollideObbToBox(sorce, destination) {
            sorce.forEach(function (src) {
                destination.forEach(function (dst) {
                    if (src.GameObject.IsClone && dst.GameObject.IsClone) {
                        if (src.GameObject != dst.GameObject) {
                            if (src.GameObject.CollisionComponent.OBB && dst.GameObject.CollisionComponent.BoundingBox)
                                if (src.GameObject.CollisionComponent.OBB.intersectsBox3(dst.GameObject.CollisionComponent.BoundingBox)) {
                                    if (!(dst.GameObject instanceof JWFramework.HeightmapTerrain)) {
                                        src.GameObject.CollisionActive();
                                    }
                                    dst.GameObject.CollisionActive(src.GameObject);
                                }
                                else {
                                    if (!(dst.GameObject instanceof JWFramework.HeightmapTerrain)) {
                                        src.GameObject.CollisionDeActive();
                                    }
                                    dst.GameObject.CollisionDeActive(src.GameObject);
                                }
                        }
                    }
                });
            });
        }
        CollideBoxToSphere(sorce, destination) {
        }
        CollideSphereToSphere(sorce, destination) {
        }
    }
    JWFramework.CollisionManager = CollisionManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class InputManager {
        constructor() {
            this.AddKey = (Code, name) => {
                this.keys.push({ KeyCode: Code, KeyName: name, KeyEvent: false, KeyPressed: false, KeyDown: false, KeyUp: false });
            };
            this.keys = [];
            window.addEventListener('keydown', (e) => {
                let key = this.keys.find(data => { return data.KeyCode == e.keyCode; });
                if (key != undefined) {
                    key.KeyEvent = true;
                }
            });
            window.addEventListener('keyup', (e) => {
                let key = this.keys.find(data => { return data.KeyCode == e.keyCode; });
                if (key != undefined) {
                    key.KeyEvent = false;
                }
            });
            this.AddKey(37, 'left');
            this.AddKey(39, 'right');
            this.AddKey(38, 'up');
            this.AddKey(40, 'down');
            this.AddKey(32, 'space');
            this.AddKey(46, 'delete');
            this.AddKey(69, 'e');
            this.AddKey(79, 'o');
            this.AddKey(80, 'p');
            this.AddKey(81, 'q');
            this.AddKey(82, 'r');
            this.AddKey(87, 'w');
            this.AddKey(83, 's');
            this.AddKey(70, 'f');
            this.AddKey(84, 't');
            this.AddKey(85, 'u');
            this.AddKey(49, '1');
            this.AddKey(50, '2');
            this.AddKey(51, '3');
            this.AddKey(52, '4');
            this.AddKey(53, '5');
            this.AddKey(54, '6');
        }
        static getInstance() {
            if (!InputManager.instance) {
                InputManager.instance = new InputManager;
            }
            return InputManager.instance;
        }
        KeyPressedCheck(key) {
            if (key.KeyEvent == true) {
                if (key.KeyDown == false && key.KeyPressed == false) {
                    key.KeyDown = true;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                else {
                    key.KeyDown = false;
                    key.KeyPressed = true;
                    key.KeyUp = false;
                }
            }
            else {
                if (key.KeyUp == true) {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = false;
                }
                else {
                    key.KeyDown = false;
                    key.KeyPressed = false;
                    key.KeyUp = true;
                }
            }
        }
        UpdateKey() {
            for (let i = 0; i < this.keys.length; ++i) {
                this.KeyPressedCheck(this.keys[i]);
            }
        }
        GetKeyState(keyName, keyState) {
            let key;
            for (let i = 0; i < this.keys.length; ++i) {
                if (this.keys[i].KeyName == keyName) {
                    if (keyState == JWFramework.KeyState.KEY_DOWN)
                        key = this.keys[i].KeyDown;
                    if (keyState == JWFramework.KeyState.KEY_PRESS)
                        key = this.keys[i].KeyPressed;
                    if (keyState == JWFramework.KeyState.KEY_UP)
                        key = this.keys[i].KeyUp;
                    return key;
                }
            }
        }
    }
    JWFramework.InputManager = InputManager;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class ObjectPool {
        constructor(objectClass) {
            this.objects = [];
            this.objectClass = objectClass;
        }
        getObject() {
            let obj;
            if (this.objects.length > 0) {
                obj = this.objects.pop();
            }
            else {
                obj = new this.objectClass();
            }
            return obj;
        }
        releaseObject(obj) {
            obj.reset();
            this.objects.push(obj);
        }
    }
    JWFramework.ObjectPool = ObjectPool;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class TestCube extends JWFramework.GameObject {
        constructor() {
            super();
            this.y = 0;
            this.type = JWFramework.ObjectType.OBJ_OBJECT3D;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
        }
        InitializeAfterLoad() {
            let axisY = new THREE.Vector3(0, 1, 0);
            this.PhysicsComponent.RotateVec3(axisY, 180);
        }
        get PhysicsComponent() {
            return this.physicsComponent;
        }
        get GraphComponent() {
            return this.graphicComponent;
        }
        Animate() {
        }
    }
    JWFramework.TestCube = TestCube;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class AircraftObject extends JWFramework.GameObject {
        constructor() {
            super();
            this.throttle = 0;
            this.afterBurner = false;
            this.acceleration = 0;
        }
        InitializeAfterLoad() {
        }
        CreateCollider() {
        }
        CollisionActive() {
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.throttle > 100) {
                this.throttle = 100;
                this.afterBurner = true;
            }
            else if (this.throttle < 100) {
                this.afterBurner = false;
            }
            else if (this.throttle < 0) {
                this.throttle = 0;
                this.afterBurner = false;
            }
        }
    }
    JWFramework.AircraftObject = AircraftObject;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class F16Object extends JWFramework.AircraftObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_AIRCRAFT;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.collisionComponent = new JWFramework.CollisionComponent(this);
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.GameObjectInstance.name = this.name;
            if (this.IsClone == false)
                JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
            else
                this.CreateCollider();
        }
        CreateCollider() {
            this.CollisionComponent.CreateBoundingBox(1, 1, 1);
            this.CollisionComponent.CreateRaycaster();
        }
        CollisionActive() {
        }
        CollisionDeActive() {
        }
        Animate() {
            if (this.isClone == true) {
                this.CollisionComponent.Update();
            }
            if (this.IsPlayer == true) {
                this.PhysicsComponent.MoveFoward(15);
                if (JWFramework.InputManager.getInstance().GetKeyState('left', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('right', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Look, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('down', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, -1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('up', JWFramework.KeyState.KEY_PRESS)) {
                    this.PhysicsComponent.RotateVec3(this.PhysicsComponent.Right, 1);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('w', JWFramework.KeyState.KEY_PRESS)) {
                    this.throttle += 2;
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('f', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_3RD);
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('r', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.CameraManager.getInstance().SetCameraSavedPosition(JWFramework.CameraMode.CAMERA_ORBIT);
                }
            }
        }
    }
    JWFramework.F16Object = F16Object;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class IRCircle extends JWFramework.GameObject {
        constructor() {
            super();
            this.type = JWFramework.ObjectType.OBJ_OBJECT2D;
            this.name = "Ircircle" + JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
            this.CreateMesh();
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
        CreateMesh() {
            this.material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setColorName("Red"),
                transparent: true,
                side: THREE.DoubleSide,
                depthTest: false
            });
            this.geometry = new THREE.RingGeometry(1, 1, 32);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.GameObjectInstance = this.mesh;
            this.InitializeAfterLoad();
        }
        Animate() {
        }
    }
    JWFramework.IRCircle = IRCircle;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class StageScene extends JWFramework.SceneBase {
        constructor(sceneManager) {
            super(sceneManager);
            this.terrain = [];
        }
        BuildSkyBox() {
        }
        BuildObject() {
            JWFramework.ModelLoadManager.getInstance().LoadScene();
            let rotation = new THREE.Matrix4().makeRotationY(-Math.PI);
            JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.applyMatrix4(rotation);
        }
        BuildLight() {
            this.light = new JWFramework.Light(JWFramework.LightType.LIGHT_DIRECTIONAL);
            this.light.SetColor(0xFFFFFF);
            this.light.Intensity = 1.5;
            this.light.GameObjectInstance.position.set(10000, 10000, 0);
            this.light2 = new JWFramework.Light(JWFramework.LightType.LIGHT_DIRECTIONAL);
            this.light2.SetColor(0xFFFFFF);
            this.light2.Intensity = 0.7;
            this.light2.GameObjectInstance.position.set(-10000, -10000, 0);
            this.SceneManager.SceneInstance.add(this.light.GameObjectInstance);
        }
        BuildFog() {
            let sceneInstance = this.SceneManager.SceneInstance;
            let color = 0xdefdff;
            sceneInstance.fog = new THREE.Fog(color, 10, 1000);
        }
        Animate() {
            if (JWFramework.ModelLoadManager.getInstance().LoadComplete == true) {
                JWFramework.ObjectManager.getInstance().Animate();
                if (JWFramework.InputManager.getInstance().GetKeyState('1', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeModify();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('2', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeClone();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('3', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeTerrain();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('4', JWFramework.KeyState.KEY_DOWN)) {
                    this.Picker.ChangePickModeRemove();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('5', JWFramework.KeyState.KEY_DOWN)) {
                    fetch("./Model/Scene.json")
                        .then(response => {
                        return response.json();
                    })
                        .then(jsondata => console.log(jsondata[0]));
                    this.BuildObject();
                }
                if (JWFramework.InputManager.getInstance().GetKeyState('delete', JWFramework.KeyState.KEY_DOWN)) {
                    JWFramework.ObjectManager.getInstance().DeleteAllObject();
                }
            }
        }
    }
    JWFramework.StageScene = StageScene;
})(JWFramework || (JWFramework = {}));
var JWFramework;
(function (JWFramework) {
    class LowCloud extends JWFramework.GameObject {
        constructor() {
            super();
            this.instanceCount = 200;
            this.positions = [];
            this.scales = [];
            this.prevMatrix = [];
            this.type = JWFramework.ObjectType.OBJ_OBJECT2D;
            this.name = "cloud" + JWFramework.ObjectManager.getInstance().GetObjectList[JWFramework.ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new JWFramework.PhysicsComponent(this);
            this.graphicComponent = new JWFramework.GraphComponent(this);
        }
        BuildClouds(x, y, z) {
            this.center = new THREE.Vector3(x, y, z);
            this.CreateBillboardMesh();
        }
        InitializeAfterLoad() {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.PhysicsComponent.SetScaleScalar(1);
            this.GameObjectInstance.name = this.name;
            JWFramework.SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            JWFramework.ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }
        CreateBillboardMesh() {
            this.material = new THREE.MeshBasicMaterial({
                map: JWFramework.ShaderManager.getInstance().cloudTexture,
                color: new THREE.Color("white"),
                fog: false,
                transparent: true,
                alphaTest: 0.01,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.NormalBlending
            });
            let geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            this.mesh = new THREE.InstancedMesh(geometry, this.material, this.instanceCount);
            this.GameObjectInstance = this.mesh;
            const radius = 800;
            const displacement = new THREE.Vector3();
            for (let i = 0; i < this.instanceCount; ++i) {
                const scale = new THREE.Vector3(600 + Math.random() * 600, 300 + Math.random() * 300, 1);
                const position = new THREE.Vector3();
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * radius;
                position.set(this.center.x + Math.sin(angle) * distance + displacement.x, (this.center.y + 700) + Math.cos(angle) * (distance - 500) + displacement.y, this.center.z + (Math.random() - 0.5) * 2 * displacement.z);
                displacement.x = (Math.random() - 0.5) * 2 * radius;
                displacement.y = (Math.random() - 0.5) * 0.1 * radius;
                displacement.z = (Math.random() - 0.5) * 2 * radius;
                this.positions.push(position);
                this.positions.push(position);
                this.scales.push(scale);
                let matrix = new THREE.Matrix4();
                matrix.scale(this.scales[i]);
                matrix.setPosition(position);
                this.prevMatrix[i] = matrix.clone();
            }
            this.InitializeAfterLoad();
        }
        Animate() {
            let cameraPos = JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
            if (JWFramework.CameraManager.getInstance().CameraMode === JWFramework.CameraMode.CAMERA_3RD)
                JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPos);
            if (cameraPos.sub(this.center).length() > 6000) {
                this.GameObjectInstance.visible = false;
            }
            else {
                this.GameObjectInstance.visible = true;
            }
            if (this.GameObjectInstance.visible == true)
                for (let i = 0; i < this.instanceCount; ++i) {
                    let cameraPosition = JWFramework.WorldManager.getInstance().MainCamera.PhysicsComponent.GetPosition().clone();
                    if (JWFramework.CameraManager.getInstance().CameraMode === JWFramework.CameraMode.CAMERA_3RD)
                        JWFramework.WorldManager.getInstance().MainCamera.CameraInstance.localToWorld(cameraPosition);
                    let position = this.positions[i].clone();
                    let matrix = new THREE.Matrix4();
                    matrix.lookAt(position, cameraPosition, new THREE.Vector3(0, 1, 0));
                    matrix.scale(this.scales[i]);
                    matrix.setPosition(position);
                    if (cameraPosition.sub(position).length() > 200) {
                        this.mesh.setMatrixAt(i, matrix);
                        this.prevMatrix[i] = matrix.clone();
                    }
                    else
                        this.mesh.setMatrixAt(i, this.prevMatrix[i]);
                }
            this.mesh.instanceMatrix.needsUpdate = true;
        }
    }
    JWFramework.LowCloud = LowCloud;
})(JWFramework || (JWFramework = {}));
//# sourceMappingURL=JWFramework.js.map