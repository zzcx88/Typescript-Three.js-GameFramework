/// <reference path="../Object/InGameUI/ObjectLabel.ts" />
namespace JWFramework
{
    export class GUIComponent
    {

        constructor(gameObject: GameObject)
        {
            this.gameObject = gameObject;

            ////게임오브젝트의 GUI컴포넌트 외 다른 컴포넌트가 감지되면 해당 컴포넌트에 해당하는 GUI클래스를 등록
            //if (this.gameObject.PhysicsCompIncluded)
            //{
            //}
            //if (this.gameObject.GraphicCompIncluded)
            //{
            //}
        }

        public GetLabel()
        {
            if (this.objectLabel != null)
                return this.objectLabel;
            else
            {
                this.objectLabel = new ObjectLabel(this.gameObject.Name);
                this.objectLabel.IsClone = true;
                this.objectLabel.ReferenceObject = this.gameObject;
                this.objectLabel.Name = this.gameObject.Name;
            }
        }

        public Dispose()
        {
            this.DisposeLabel();
        }

        private DisposeLabel()
        {
            this.objectLabel.DeleteObject();
            this.objectLabel.ReferenceObject = null;
        }

        public UpdateDisplay()
        {
            if (this.gameObject.PhysicsCompIncluded)
            {
            }
            if (this.gameObject.GraphicCompIncluded)
            {
            }
        }

        public ShowGUI(show: boolean)
        {
        }

        private gameObject: GameObject;
        private objectLabel: ObjectLabel;
    }
}