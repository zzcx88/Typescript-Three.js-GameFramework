import { GUI } from 'dat.gui';
import { GUI_Base } from './GUI_Base';
import { TerrainOption } from '../../enum';
import { WorldManager } from '../../Manager/WorldManager';


export class GUI_Terrain extends GUI_Base
{
    constructor()
    {
        super();
        this.datGui = new GUI();
        this.datGui.domElement.id = 'terrain-gui-container';

        this.datGui.open();
        this.CreateFolder();
        this.AddElement();
        this.datGui.width = WorldManager.getInstance().Canvas.width / 8;
    }

    protected CreateFolder()
    {
        this.terrainOptionFolder = this.datGui.addFolder('Terrain');
    }

    protected AddElement()
    {
        const item = [];

        item.push('UP');
        item.push('DOWN');
        item.push('BALANCE');

        this.terrainOptionFolder.add(this.propList, 'TerrainOptionList', item).listen();
        this.terrainOptionFolder.add(this.propList, 'HeightOffset').step(0.01).listen();
        this.propList.TerrainOptionList = 'UP';
        this.terrainOptionFolder.open();

    }

    public GetTerrainOption()
    {
        return this.terrainOption
    }

    public GetHeightOffset()
    {
        return this.propList.HeightOffset;
    }

    public ChangeHeightOffset()
    {
        if (this.propList.HeightOffset == 0)
            this.propList.HeightOffset = -1;
        else if (this.propList.HeightOffset == -1)
            this.propList.HeightOffset = 1;
        else if (this.propList.HeightOffset == 1)
            this.propList.HeightOffset = 0;

        this.propList.HeightOffset;
    }

    public ChangeTerrainOption()
    {

        if (this.terrainOption == TerrainOption.TERRAIN_BALANCE)
            this.terrainOption = TerrainOption.TERRAIN_UP;
        else
            this.terrainOption++;

        this.SetTerrainOptionFromEnum();
    }

    private SetTerrainOptionFromEnum()
    {
        if (this.terrainOption == TerrainOption.TERRAIN_UP)
            this.propList.TerrainOptionList = 'UP'
        if (this.terrainOption == TerrainOption.TERRAIN_DOWN)
            this.propList.TerrainOptionList = 'DOWN'
        if (this.terrainOption == TerrainOption.TERRAIN_BALANCE)
            this.propList.TerrainOptionList = 'BALANCE'
    }

    public SetTerrainOptionList()
    {
        if (this.propList.TerrainOptionList == 'UP')
            this.terrainOption = TerrainOption.TERRAIN_UP;
        if (this.propList.TerrainOptionList == 'DOWN')
            this.terrainOption = TerrainOption.TERRAIN_DOWN;
        if (this.propList.TerrainOptionList == 'BALANCE')
            this.terrainOption = TerrainOption.TERRAIN_BALANCE;
    }


    private datGui: GUI;
    private terrainOptionFolder: GUI;
    private propList = {
        TerrainOptionList: "None",
        HeightOffset: 0
    };
    private terrainOption: TerrainOption = TerrainOption.TERRAIN_UP;
    //private terrainOffset: number = 0;
}
