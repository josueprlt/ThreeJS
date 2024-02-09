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
scene.background = new THREE.CubeTextureLoader()
	.setPath( 'Maskonaive/' )
	.load( [
				'posx.jpg',
				'negx.jpg',
				'posy.jpg',
				'negy.jpg',
				'posz.jpg',
				'negz.jpg'
			] );


const objects = [];

// Geometry plane JS
const planeGeometry = new THREE.PlaneGeometry( 25, 25, 32, 32 );
const planeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } )
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add( plane );

// Geometry cube JS
const geometryBox = new THREE.BoxGeometry( 2.5, 5, 1 ); 
const materialBox = new THREE.MeshBasicMaterial( {color: 0xC7C7C7} ); 
const cube = new THREE.Mesh( geometryBox, materialBox );
cube.translateY(3);
cube.castShadow = true; //default is false
cube.receiveShadow = false;
scene.add( cube );

// Camera
const camera = new THREE.PerspectiveCamera(50, 800/600);
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
const renderer = new THREE.WebGLRenderer({canvas, antialias: true });
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



let rotateCube = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

  rotateCube = rotateCube + 0.01;
  cube.rotation.set(0, rotateCube, 0);

  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();



 
