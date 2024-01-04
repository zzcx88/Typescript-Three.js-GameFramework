/// <reference path="Manager/WorldManager.ts" />
/// <reference path="Manager/UnitConvertManager.ts" />
{
    //initialize
    const worldManager: JWFramework.WorldManager = JWFramework.WorldManager.getInstance();
    worldManager.InitializeWorld();

    let stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.top = "450px";
    stats.dom.style.left = "5px";
    document.body.appendChild(stats.dom);

    //GameLoop
    const main = function ()
    {
        stats.begin();

        worldManager.Animate();
        worldManager.Render();

        stats.end();

        requestAnimationFrame(main);
    }
    main();
}