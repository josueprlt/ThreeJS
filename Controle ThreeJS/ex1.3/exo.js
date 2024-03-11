import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

const marques = [];

// Plane
const Plane = new THREE.PlaneGeometry(15, 15);
const material = new THREE.MeshStandardMaterial({color: 0xE16D19});
const mesh = new THREE.Mesh(Plane, material);
mesh.receiveShadow = true;
scene.add(mesh);


// Cylinder
const Cylinder = new THREE.CylinderGeometry(1, 1, .25, 32);
const materialCylinder = new THREE.MeshStandardMaterial({color: 0xffffff});
const meshCylinder = new THREE.Mesh(Cylinder, materialCylinder);
meshCylinder.rotation.set(Math.PI * -0.5, 0, 0);
meshCylinder.position.set(0, 3, 1);
meshCylinder.castShadow = true; //default is false
meshCylinder.receiveShadow = true;
scene.add(meshCylinder);


//Boite noir 1
const cubeHour = new THREE.BoxGeometry(0.1, 0.5, 0.1);
const materialHour = new THREE.MeshStandardMaterial({color: 0x000000});
const meshHour = new THREE.Mesh(cubeHour, materialHour);
meshHour.position.set(0, 3.3, 1.35);
meshHour.castShadow = true;
meshHour.receiveShadow = true;
scene.add(meshHour);

//Boite noir 2
const cubeMinutes = new THREE.BoxGeometry(0.1, 0.7, 0.1);
const materialMinutes = new THREE.MeshStandardMaterial({color: 0x000000});
const meshMinutes = new THREE.Mesh(cubeMinutes, materialMinutes);
meshMinutes.position.set(0.25, 2.9, 1.35);
meshMinutes.rotation.set(0, 0, 45);
meshMinutes.castShadow = true;
meshMinutes.receiveShadow = true;
scene.add(meshMinutes);

//Boite rouge
const cubeTroteuse = new THREE.BoxGeometry(0.05, 0.7, 0.05);
const materialTroteuse = new THREE.MeshStandardMaterial({color: 0xFF0000});
const meshTroteuse = new THREE.Mesh(cubeTroteuse, materialTroteuse);
meshTroteuse.position.set(-0.3, 2.9, 1.35);
meshTroteuse.rotation.set(0, 0, 90);
meshTroteuse.castShadow = true;
meshTroteuse.receiveShadow = true;
scene.add(meshTroteuse);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 10);
light.castShadow = true;
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
const renderer = new THREE.WebGLRenderer({canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function Renderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

requestAnimationFrame(Renderer);

let counter = 0;
let rotateMinutes = 0;
let angle = 0

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
  while (counter < 12) {
    const cubeHorloge = new THREE.BoxGeometry(0.05, 0.1, 0.05);
    const materialHorloge = new THREE.MeshStandardMaterial({color: 0x000000});
    const meshHorloge = new THREE.Mesh(cubeHorloge, materialHorloge);
    meshHorloge.position.set(1*Math.cos(angle), 3.5, 1*Math.sin(angle));
    meshHorloge.rotation.set(0, Math.PI * -0.5, rotateMinutes);
    meshHorloge.castShadow = true;
    meshHorloge.receiveShadow = true;


    scene.add(meshHorloge);
    
    counter++;
    angle += 0.5;
    rotateMinutes += 25;
  }

  
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
