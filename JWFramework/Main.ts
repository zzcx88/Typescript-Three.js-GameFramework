import Stats from 'stats.js';
import { WorldManager } from './Manager/WorldManager';

{
    //initialize
    const worldManager: WorldManager = WorldManager.getInstance();
    worldManager.InitializeWorld();

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.top = "auto";
    stats.dom.style.left = "auto";
    document.getElementById("info").appendChild(stats.dom);

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
