import * as THREE from 'three';


// Scene
const scene = new THREE.Scene();


// Sphere
const geometry = new THREE.SphereGeometry(3, 15, 15);
/* const material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  emissive: 0x000000,
  emissiveIntensity: 1,
  lights: true
}); */

const material = new THREE.MeshPhysicalMaterial({
  color: 0xff5fff,
  roughness: 0.5,
  metalness: 0.5,
  reflectivity: 0.5,
  clearCoat: 0.5,
  clearCoatRoughness: 0.5,
  lights: true,
  flatShading: false
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

function Renderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

requestAnimationFrame(Renderer);


let degreeY = 0;
let angle = 0;

const loop = () => {
  
  /* mesh.rotateY(degreeY+0.01); */
  light.position.set(10*Math.cos(angle), 10, 10*Math.sin(angle));
  angle = angle + 0.05;

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}




window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

loop();