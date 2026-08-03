import { GUI } from 'dat.gui';
import { EditObject } from '../../Object/EditObject/EditObject';
import { GUI_Base } from './GUI_Base';
import { ObjectManager } from '../../Manager/ObjectManager';
import { ObjectType } from '../../enum';
import { SceneManager } from '../../Manager/SceneManager';
import { Water } from '../../Object/InGameObject/Environment/Water';
import { WorldManager } from '../../Manager/WorldManager';


export class GUI_Select extends GUI_Base
{
    constructor()
    {
        super();
        this.datGui = new GUI();
        this.datGui.domElement.id = 'select-gui-container';

        this.datGui.open();
        this.CreateFolder();
        this.AddElement();
        this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
    }

    protected CreateFolder()
    {
        this.objectListFolder = this.datGui.addFolder('ObjectList');
        this.exportButtonFolder = this.datGui.addFolder('Output');
    }

    protected AddElement()
    {
        const item = [];
        const objectList = ObjectManager.getInstance().GetObjectList;
        for (let TYPE = ObjectType.OBJ_OBJECT3D; TYPE < ObjectType.OBJ_END; ++TYPE)
        {
            for (let OBJ = 0; OBJ < objectList[TYPE].length; ++OBJ)
            {
                if (objectList[TYPE][OBJ].GameObject instanceof EditObject)
                    item.push(objectList[TYPE][OBJ].Name);
            }
        }
        item.push("Water");

        this.objectListFolder.add(this.List, 'ObjectList', item);
        this.objectListFolder.open();

        this.makeJson = function ()
        {
            this.ExportData = function () { SceneManager.getInstance().MakeJSON(); }
        }
        this.makeJson = new this.makeJson();

        this.exportButtonFolder.add(this.makeJson, 'ExportData');
        this.exportButtonFolder.open();
    }

    public GetSelectObjectName()
    {
        return this.List.ObjectList;
    }


    private datGui: GUI;
    private objectListFolder: GUI;
    private exportButtonFolder: GUI;
    //private ExportData;
    private makeJson;
    private List = {
        ObjectList: "None"
    };
}
