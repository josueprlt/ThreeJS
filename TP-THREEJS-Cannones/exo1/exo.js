import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from './script.js';

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;

  if (float) {
      return val;
  }
  return Math.floor(val);
}



// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xC0DFEF);

// Plane
const planeGeometry = new THREE.PlaneGeometry(150, 150);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(-Math.PI / 2, 0, 0);
scene.add(plane);

// Sphere
const radiusSphere = 1 // m
const geometry = new THREE.SphereGeometry(radiusSphere)
const material = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(geometry, material)
scene.add(sphereMesh)

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x404040);
scene.add(aLight);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
scene.add(camera);

// Helpers
scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.DirectionalLightHelper(light));
scene.add(new THREE.GridHelper(10, 15));

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Physics
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// Create a sphere body
const radius = 1;
const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 10, 0);
world.addBody(sphereBody);

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

window.addEventListener("keydown", (event) => {
  if (event.code === 'Space') {
    // Appliquer une force à la sphère
    const force = new CANNON.Vec3(random(-500, 500), 1500, random(-500, 500)); // Par exemple, une force de 100 unités sur l'axe X
    const worldPoint = new CANNON.Vec3(0, 0, 0); // Point d'application de la force (le centre de la sphère)
    sphereBody.applyForce(force, worldPoint);
  }
}); 

// Animation loop
plane.position.copy(groundBody.position);
function animate() {
  world.fixedStep();
  
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate()

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

animate();