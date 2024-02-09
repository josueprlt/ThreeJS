// Au début du fichier
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// Pour la mise à jour
stats.update();

// Scene
const scene = new THREE.Scene();

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
const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // agrandit le soleil
solarSystem.add(sunMesh);
objects.push(sunMesh);



const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);


const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);



const camera = new THREE.PerspectiveCamera(50, 800/600);
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

gui.add( myObject, 'Soleil' ).onChange( value => {
	if (value) {
    sunMesh.visible = true;
  } else {
    sunMesh.visible = false;
  }
} ); 	// checkbox
gui.add( myObject, 'Terre' ).onChange( value => {
	if (value) {
    earthMesh.visible = true;
  } else {
    earthMesh.visible = false;
  }
} );
gui.add( myObject, 'Lune' ).onChange( value => {
	if (value) {
    moonMesh.visible = true;
  } else {
    moonMesh.visible = false;
  }
} );
gui.add( myObject, 'Grille' ).onChange( value => {
	if (value) {
    meshGrille.visible = true;
  } else {
    meshGrille.visible = false;
  }
} );
gui.add( myObject, 'vitesse', 0.01, 0.15, 0.01);



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
}

loop();



 
