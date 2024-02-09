// Au début du fichier
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load( "/TP2/exercice2/textures/espace.jpg" );

// un tableau d'objets dont la rotation doit être mise à jour
const objects = [];

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

// n'utilise qu'une seule sphère pour tout
const sphereGeometry = new THREE.SphereGeometry(1, 25, 25);

const sunMaterial = new THREE.MeshPhongMaterial({
  emissive: 0xffff00,
  emissiveMap: new THREE.TextureLoader().load('/TP2/exercice2/textures/soleil.jpg'),
  emissiveIntensity: 1
});

const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // agrandit le soleil
solarSystem.add(sunMesh);
objects.push(sunMesh);



const earthColor = "./textures/earthmap1k.jpg";
const earthBump = "./textures/earthbump1k.jpg";
const earthSpec = "./textures/earthspec1k.jpg";
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
   map: textureLoader.load(earthColor),
   bumpMap: textureLoader.load(earthBump),
   specularMap: textureLoader.load(earthSpec),
   bumpScale: 0.25,
   shininess: 1
});

const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);


const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);



const geometry = new THREE.TorusGeometry( 10, 0.1, 30, 200 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
const torus = new THREE.Mesh( geometry, material );
torus.rotation.set( Math.PI * 0.5, 0, 0);
scene.add( torus );



const camera = new THREE.PerspectiveCamera(50, 800 / 600);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
// Light
const light = new THREE.PointLight(0xffffff, 3);
scene.add(light);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

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
let meshGrille = new THREE.GridHelper(25);
scene.add(meshGrille);


const gui = new GUI();

const myObject = {
  Soleil: true,
  Terre: true,
  Lune: true,
  Grille: true,
  vitesse: 0.01,
};

gui.add(myObject, 'Soleil').onChange(value => {
  if (value) {
    sunMesh.visible = true;
  } else {
    sunMesh.visible = false;
  }
}); 	// checkbox
gui.add(myObject, 'Terre').onChange(value => {
  if (value) {
    earthMesh.visible = true;
  } else {
    earthMesh.visible = false;
  }
});
gui.add(myObject, 'Lune').onChange(value => {
  if (value) {
    moonMesh.visible = true;
  } else {
    moonMesh.visible = false;
  }
});
gui.add(myObject, 'Grille').onChange(value => {
  if (value) {
    meshGrille.visible = true;
  } else {
    meshGrille.visible = false;
  }
});
gui.add(myObject, 'vitesse', 0.01, 0.15, 0.01);



let degreeY = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
  objects.forEach((obj) => {
    obj.rotation.y = degreeY;
  });
  degreeY = degreeY + myObject.vitesse;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
}

loop();




