namespace JWFramework
{
    export class ObjectManager
    {

        private static instance: ObjectManager;

        public constructor(){}

        static getInstance()
        {
            if (!ObjectManager.instance) {
                ObjectManager.instance = new ObjectManager;
            }
            return ObjectManager.instance;
        }

        public GetObjectsFromType() { }

        public GetObjectFromName(name: string): GameObject
        {
            for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (name == this.objectList[TYPE][OBJ].GameObject.Name) {
                        return this.objectList[TYPE][OBJ].GameObject;
                    }
                }
            }
            return null;
        }

        public GetInSectorTerrain()
        {
            let terrain: GameObject;
            for (let OBJ = 0; OBJ < this.objectList[ObjectType.OBJ_TERRAIN].length; ++OBJ) {
                terrain = this.objectList[ObjectType.OBJ_TERRAIN][OBJ].GameObject;
                if ((terrain as unknown as HeightmapTerrain).cameraInSecter == true)
                    this.terrainList.add(terrain.GameObjectInstance);
            }
            return this.terrainList;
        }

        public get GetObjectList()
        {
            return this.objectList;
        }

        public ClearExportObjectList()
        {
            this.exportObjectList = [];
            this.exportObjectList.length = 0;
        }

        public AddObject(gameObject: GameObject, name: string, type: ObjectType)
        {
            this.objectList[type].push({ GameObject: gameObject, Name: name });
            if (gameObject.IsClone == true && type != ObjectType.OBJ_CAMERA) {
                SceneManager.getInstance().SceneInstance.add(gameObject.GameObjectInstance);
            }
        }

        public MakeClone(selectObject: GameObject): GameObject
        {
            let cloneObject: GameObject;

            //해당 인스턴스로 생성이 가능한지 판별
            if (selectObject instanceof EditObject) {
                cloneObject = new EditObject;
            }
            else {
                if (selectObject == null)
                    alert("EmptyObject")
                else
                    alert(selectObject.Name.toUpperCase() + " Instance of class name not found");
                return;
            }

            cloneObject.IsClone = true;
            cloneObject.Name = selectObject.Name + "Clone" + ObjectManager.getInstance().GetObjectList[cloneObject.Type].length.toString();
            if (selectObject.ModelData.animations.length != 0) {
                cloneObject.ModelData = selectObject.ModelData;
                cloneObject.GameObjectInstance = THREE.SkeletonUtils.clone(cloneObject.ModelData.scene);
                cloneObject.AnimationMixer = new THREE.AnimationMixer(cloneObject.GameObjectInstance);
                cloneObject.AnimationMixer.clipAction(cloneObject.ModelData.animations[0]).play();
            }
            else
                cloneObject.GameObjectInstance = selectObject.ModelData.scene.clone();
            cloneObject.InitializeAfterLoad();
            return cloneObject;
        }

        public MakeJSONArray()
        {
            for (let TYPE = ObjectType.OBJ_TERRAIN; TYPE < ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    if (this.objectList[TYPE][OBJ].GameObject.IsClone == true || this.objectList[TYPE][OBJ].GameObject.Type == ObjectType.OBJ_TERRAIN) {
                        this.exportObjectList.push(this.objectList[TYPE][OBJ].GameObject.ExportComponent.MakeJsonObject())
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

        public DeleteObject(gameObject: GameObject)
        {
            gameObject.GameObjectInstance.traverse(node =>
            {
                if (node.isMesh || node.isGroup)
                {
                    if (node.geometry)
                    {
                        node.geometry.dispose();
                    }
                    if (node.material)
                        if (Array.isArray(node.material))
                        {
                            for (let i = 0; i < node.material.length; ++i)
                            {
                                node.material[i].dispose();
                                if (node.material[i].map)
                                    node.material[i].map.dispose();
                            }
                        }
                        else
                        {
                            node.material.dispose();
                            if (node.material.map)
                                node.material.map.dispose();
                        }
                }
            });
            if (gameObject instanceof HeightmapTerrain)
            {
                (gameObject as HeightmapTerrain).inSectorObject = [];
                (gameObject as HeightmapTerrain).inSectorObject = null;
            }
            gameObject.CollisionComponent.DeleteCollider();
            gameObject.DeleteAllComponent();

            delete gameObject.ModelData;
            gameObject.ModelData = null;
            gameObject.GameObjectInstance.clear();
            gameObject.GameObjectInstance.removeFromParent();
            SceneManager.getInstance().SceneInstance.remove(gameObject.GameObjectInstance);
            delete gameObject.GameObjectInstance;
            gameObject.GameObjectInstance = null;
            gameObject = null;
            this.ClearExportObjectList();
        }

        public DeleteAllObject()
        {
            this.objectList.forEach(function (type)
            {
                type.forEach(function (object)
                {
                    if (object.GameObject.Type != ObjectType.OBJ_CAMERA && object.GameObject.IsClone == true)
                    {
                        //ObjectManager.getInstance().DeleteObject(object.GameObject);
                        object.GameObject.IsDead = true;
                    }
                })
            })
        }

        private RenderOffObject() { }

        public Animate()
        {
            for (let TYPE = 0; TYPE < ObjectType.OBJ_END; ++TYPE) {
                for (let OBJ = 0; OBJ < this.objectList[TYPE].length; ++OBJ) {
                    this.objectList[TYPE][OBJ].GameObject.Animate();

                    if (this.objectList[TYPE][OBJ].GameObject.PhysicsCompIncluded == true)
                        this.objectList[TYPE][OBJ].GameObject.PhysicsComponent.UpdateMatrix();

                    if (this.objectList[TYPE][OBJ].GameObject.IsDead) {
                        this.DeleteObject(this.objectList[TYPE][OBJ].GameObject);
                        this.objectList[TYPE][OBJ] = null;
                        delete this.objectList[TYPE][OBJ];
                        
                        this.objectList[TYPE] = this.objectList[TYPE].filter((element, OBJ) => element !== undefined);
                    }
                }
            }
            //CollisionManager.getInstance().CollideBoxToBox(this.objectList[ObjectType.OBJ_TERRAIN], this.objectList[ObjectType.OBJ_CAMERA]);
            //CollisionManager.getInstance().CollideObbToObb(this.objectList[ObjectType.OBJ_OBJECT3D], this.objectList[ObjectType.OBJ_OBJECT3D]);
            CollisionManager.getInstance().CollideObbToBox(this.objectList[ObjectType.OBJ_OBJECT3D], this.objectList[ObjectType.OBJ_TERRAIN]);
            let sectoredTerrain = this.objectList[ObjectType.OBJ_TERRAIN].filter((element) => (element.GameObject as unknown as HeightmapTerrain).inSecter == true);
            CollisionManager.getInstance().CollideRayToTerrain(sectoredTerrain);
            sectoredTerrain.forEach(function (src)
            {
                CollisionManager.getInstance().CollideObbToObb((src.GameObject as HeightmapTerrain).inSectorObject, (src.GameObject as HeightmapTerrain).inSectorObject);
            });

            InputManager.getInstance().UpdateKey();
        }

        public Render() { }

        private terrainList = new THREE.Group();
        private objectList: ObjectSet[][] = [[], [], [], [], []];
        private exportObjectList = [];
    }
}