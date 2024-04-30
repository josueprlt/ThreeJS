// Au début du fichier
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// Pour la mise à jour
stats.update();

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
.setPath('Maskonaive/')
.load([
  'posx.jpg',
  'negx.jpg',
  'posy.jpg',
  'negy.jpg',
  'posz.jpg',
  'negz.jpg'
]);

const object = [];
scene.add(object);

// Geometry Cylinder JS
const CylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32); //1.5, 1.5, 30, 32
const CylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
const cylinder = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
const cylinder1 = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
cylinder.receiveShadow = true;
cylinder.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.5);
cylinder.position.set(0, 10, 0);
cylinder.scale.set(2, 8, 2);
scene.add(cylinder);
object.push(cylinder);

cylinder1.rotation.set(0, 0, 0);
cylinder1.position.set(0, 2, 0);
/* boule.rotateOnAxis(50, 0);
boule.add(cylinder1); */
object.push(cylinder1);

// Geometry Sphere JS
const SphereGeometry = new THREE.SphereGeometry(2, 32, 32);
const SphereMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
const sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
sphere.receiveShadow = true;
sphere.position.set(0, 6, 0);
/* boule.add(sphere); */
object.push(sphere);

/* for (let i = 1; i < 9; i++) {
  const boule = new THREE.Object3D();
  boule.position.set(-12, 10, 0);
  scene.add(boule);
  object.push(boule);
} */

// Geometry plane JS
const planeGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(plane);


// Camera
const camera = new THREE.PerspectiveCamera(50, 800 / 600);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


// Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true; // default false
scene.add(light);


light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function Renderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

requestAnimationFrame(Renderer);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

//helper
scene.add(new THREE.DirectionalLightHelper(light));

let go = false;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let loop = () => {
  const speed = 0.005; // Vitesse de rotation
  const angle = Math.sin(Date.now() * speed) * Math.PI / 2; // Angle de rotation en fonction du temps
  
  /* boule.rotation.set(angle - Math.PI, 0, 0); */

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();

function activeKey() {
  go = true;
}

document.body.addEventListener("keydown", activeKey);