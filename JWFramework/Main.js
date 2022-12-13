{
    const worldManager = JWFramework.WorldManager.getInstance();
    worldManager.InitializeWorld();
    const main = function () {
        worldManager.Animate();
        worldManager.Render();
        requestAnimationFrame(main);
    };
    main();
}
//# sourceMappingURL=Main.js.map