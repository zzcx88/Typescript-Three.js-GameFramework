/// <reference path="../GameObject.ts" />
namespace JWFramework
{
    export class ObjectLabel extends GameObject
    {
        constructor()
        {
            super();
            this.type = ObjectType.OBJ_OBJECT2D;
            this.name = "ObjectLabel" + ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT2D].length;
            this.physicsComponent = new PhysicsComponent(this);
            this.graphicComponent = new GraphComponent(this);
            this.CreateBillboardMesh();
        }

        public get ReferenceObject(): GameObject
        {
            return this.referenceObject;
        }

        public set ReferenceObject(object: GameObject)
        {
            this.referenceObject = object;
        }

        public InitializeAfterLoad()
        {
            this.GameObjectInstance.matrixAutoUpdate = true;
            this.GameObjectInstance.name = this.name;

            SceneManager.getInstance().SceneInstance.add(this.gameObjectInstance);
            ObjectManager.getInstance().AddObject(this, this.name, this.Type);
        }

        private CreateBillboardMesh()
        {
            let labelTexture = this.MakeCanvasTexture(this.name);
            labelTexture.minFilter = THREE.LinearFilter;
            labelTexture.wrapS = THREE.ClampToEdgeWrapping;
            labelTexture.wrapT = THREE.ClampToEdgeWrapping;
            this.material = new THREE.SpriteMaterial({
                map: labelTexture,
                transparent: true,
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

        private MakeCanvasTexture(name: string, size: number = 40): THREE.CanvasTexture
        {
            const baseWidth = 150;
            const borderSize = 2;
            if (this.referenceObject == null)
                this.labelContext = document.createElement('canvas').getContext('2d');
            let font = `${size}px bold Verdana`;
            this.labelContext.font = font;
            // measure how long the name will be
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

            this.labelContext.translate(width / 2, height / 2 );
            this.labelContext.scale(scaleFactor, 1);
            this.labelContext.fillStyle = 'red';

            if (this.referenceObject != null)
            {
                this.labelContext.fillText(this.referenceObject.Name, 0, -50);
            }
            this.labelContext.fillText(name, 0, 50);

            if (this.referenceObject == null)
                return new THREE.CanvasTexture(this.labelContext.canvas);
            else
            {
                this.material.map.needsUpdate = true;
                //this.material.needsUpdate = true;
                return null;
            }
        }

        public Animate()
        {
            if (this.referenceObject != undefined)
            {
                if (this.referenceObject.Picked == false)
                {
                    this.material.visible = true;
                    let refObjectPosition = this.referenceObject.PhysicsComponent.GetPosition().clone();
                    this.physicsComponent.SetPostion(refObjectPosition.x, refObjectPosition.y, refObjectPosition.z);
                    let pickObject = ObjectManager.getInstance().GetObjectList[ObjectType.OBJ_OBJECT3D].filter(o => o.GameObject.Picked == true);
                    if (pickObject[0] != undefined)
                    {
                        let length = UnitConvertManager.getInstance().ConvertToDistance(this.referenceObject.PhysicsComponent.GetPosition().clone().sub(pickObject[0].GameObject.PhysicsComponent.GetPosition().clone()).length())
                        length = Math.round(length);
                        if (length > 10000)
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

        private mesh: THREE.Sprite;
        private material: THREE.SpriteMaterial;
        private labelContext: CanvasRenderingContext2D;
        private referenceObject: GameObject;
    }

}
