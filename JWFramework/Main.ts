/// <reference path="Manager/WorldManager.ts" />
/// <reference path="Manager/UnitConvertManager.ts" />
{
    //initialize
    const worldManager: JWFramework.WorldManager = JWFramework.WorldManager.getInstance();
    worldManager.InitializeWorld();

    //GameLoop
    const main = function ()
    {
        worldManager.Animate();
        worldManager.Render();

        requestAnimationFrame(main);
    }
    main();
}