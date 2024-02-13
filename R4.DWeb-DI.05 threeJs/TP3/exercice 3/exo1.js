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

let counter = 0;
let x = 15;
let y = 9;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
let loop = () => {

  while (counter < 70) {
    const cubeGeometry = new THREE.BoxGeometry(1, Math.floor(Math.random() * (10 - 3)) + 3, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    const box = new THREE.Mesh(cubeGeometry, cubeMaterial);
    box.receiveShadow = true;
    box.castShadow = true;

    if (x <= -10) {
      y-=2;
      x = 15;
    }
    box.position.set(x-=4, 5, y); 
    scene.add(box);

    counter++;
  }
    
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();