{
    //initialize
    var worldManager_1 = JWFramework.WorldManager.getInstance();
    worldManager_1.InitializeWorld();
    //GameLoop
    var main_1 = function () {
        worldManager_1.Animate();
        worldManager_1.Render();
        requestAnimationFrame(main_1);
    };
    main_1();
}
//# sourceMappingURL=main.js.map