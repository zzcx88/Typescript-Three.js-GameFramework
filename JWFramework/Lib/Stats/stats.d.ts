declare class Panel
{
    constructor(name: any, foreground: any, background: any, msRefresh: any, refreshCallback: any);
    name: any;
    foreground: any;
    background: any;
    msRefresh: any;
    refreshCallback: any;
    data: any[];
    _min: number;
    _max: number;
    lastTime: number;
    pixelRatio: number;
    width: number;
    height: number;
    text: {
        position: {
            x: number;
            y: number;
        };
    };
    graph: {
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        };
    };
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    dom: HTMLCanvasElement;
    get min(): number;
    get max(): number;
    init(): void;
    update(time: any): void;
}
declare class Stats
{
    mode: number;
    dom: HTMLDivElement;
    panels: Panel[];
    background: string;
    beginTime: number;
    frames: number;
    addPanel(name: any, foreground: any, msRefresh: any, refreshCallback: any): Panel;
    showPanel(id: any): void;
    begin(): void;
    end(): number;
    update(): void;
    addPanelObject(panel: any): void;
    initStyle(): void;
    updateStyle(): void;
}
