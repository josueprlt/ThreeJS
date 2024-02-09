import * as THREE from 'three';


// Scene
const scene = new THREE.Scene();


// Sphere
const geometry = new THREE.SphereGeometry(5, 16, 16);
/* const material = new THREE.MeshBasicMaterial({
   color: 0xffffff,
   wireframe: true,
}); */

const material = new THREE.MeshPhysicalMaterial({
    color: 0xff5fff,
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.5,
    clearCoat: 0.5,
    clearCoatRoughness: 0.5,
    lights: true,
    flatShading: true
  });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);