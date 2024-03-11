import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();


// Plane
const Plane = new THREE.PlaneGeometry(15, 15);

const material = new THREE.MeshLambertMaterial({
  color: 0xDB6900,
  emissive: 0x000000,
  emissiveIntensity: 1,
  lights: true
});
const mesh = new THREE.Mesh(Plane, material);
scene.add(mesh);


// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x404040);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


//Helper
scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.DirectionalLightHelper(light));
scene.add(new THREE.GridHelper(10, 15));


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

function Renderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

requestAnimationFrame(Renderer);


const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();




window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});
