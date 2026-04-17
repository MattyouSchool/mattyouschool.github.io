import * as THREE from 'three';
import * as CANNON from 'cannon';

let world, scene, camera, renderer, ball, car, ballBody, carBody;
let score = { blue: 0, orange: 0 };
const keys = {};

// --- PHYSICS SETUP ---
function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // Zwaartekracht

    // Grond physics
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(new CANNON.Plane());
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    // Bal physics
    ballBody = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(1.5) });
    ballBody.position.set(0, 10, 0);
    ballBody.linearDamping = 0.5; // Zorgt dat de bal uitrolt
    world.addBody(ballBody);

    // Auto physics (Box)
    carBody = new CANNON.Body({ mass: 5, shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2)) });
    carBody.position.set(0, 1, 20);
    world.addBody(carBody);
}

// --- GRAPHICS SETUP ---
function initGraphics() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Arena vloer
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 100), new THREE.MeshPhongMaterial({ color: 0x228B22 }));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Bal visueel
    const ballGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const ballMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    ball = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ball);

    // Auto visueel
    const carGeo = new THREE.BoxGeometry(2, 1, 4);
    const carMat = new THREE.MeshPhongMaterial({ color: 0x00bcff });
    car = new THREE.Mesh(carGeo, carMat);
    scene.add(car);

    // Licht
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
}

// --- BESTURING ---
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function updateCar() {
    const force = 20;
    if (keys['ArrowUp'] || keys['KeyW']) carBody.velocity.z -= force * 0.1;
    if (keys['ArrowDown'] || keys['KeyS']) carBody.velocity.z += force * 0.1;
    if (keys['ArrowLeft'] || keys['KeyA']) carBody.angularVelocity.y += 0.1;
    if (keys['ArrowRight'] || keys['KeyD']) carBody.angularVelocity.y -= 0.1;

    // Camera volgt auto
    camera.position.set(car.position.x, car.position.y + 5, car.position.z + 12);
    camera.lookAt(car.position);
}

// --- GAME LOOP ---
function animate() {
    requestAnimationFrame(animate);
    world.step(1/60); // Update physics

    // Koppel physics aan graphics
    ball.position.copy(ballBody.position);
    ball.quaternion.copy(ballBody.quaternion);
    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);

    updateCar();

    // Goal check (simpel)
    if (ballBody.position.z < -50) {
        score.blue++;
        resetBall();
    }

    renderer.render(scene, camera);
}

function resetBall() {
    ballBody.position.set(0, 5, 0);
    ballBody.velocity.set(0, 0, 0);
}

// Start knop actie
document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('ui').style.display = 'block';
    initPhysics();
    initGraphics();
    animate();
});
