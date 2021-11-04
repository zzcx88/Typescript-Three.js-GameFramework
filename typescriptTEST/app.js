//class Greeter {
//    private element: HTMLElement;
//    private span: HTMLElement;
//    private timerToken: number;
//    letructor(element: HTMLElement) {
//        this.element = element;
//        this.element.innerHTML += "The time is: ";
//        this.span = document.createElement("span");
//        this.element.appendChild(this.span);
//        this.span.innerText = new Date().toUTCString();
//    }
//    public start() {
//        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
//    }
//    public stop() {
//        clearTimeout(this.timerToken);
//    }
//}
//window.onload = () => {
//    let el = document.getElementById("content");
//    let greeter = new Greeter(el);
//    greeter.start();
//};
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;
var animate = function () {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};
animate();
//# sourceMappingURL=app.js.map