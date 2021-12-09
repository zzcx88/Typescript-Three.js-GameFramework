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
            for (let TYPE = JWFramework.ObjectType.OBJ_OBJECT3D; TYPE < JWFramework.ObjectType.OBJ_OBJECT2D; ++TYPE) {
                for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ) {
                    item.push(objectList[TYPE][OBJ].Name);
                }
            }
            ////
            //for (let i = 0; i < ObjectManager.getInstance().GetObjectList.length; ++i) {
            //    if (ObjectManager.getInstance().GetObjectList[i].Name != "Terrain")
            //        item[i] = ObjectManager.getInstance().GetObjectList[i].Name;
            //}
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
//# sourceMappingURL=GUI_Select.js.map