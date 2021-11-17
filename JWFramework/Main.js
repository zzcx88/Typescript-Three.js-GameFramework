{
    //initialize
    const worldManager = JWFramework.WorldManager.getInstance();
    worldManager.InitializeWorld();
    //GameLoop
    const main = function () {
        worldManager.Animate();
        worldManager.Render();
        requestAnimationFrame(main);
    };
    main();
}
//# sourceMappingURL=Main.js.map