// Au début du fichier
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Geometry model3D JS
const loader = new GLTFLoader();

let fuse = null;

loader.load('rocketship/Rocketship.glb', function (glb) {

  fuse = glb.scene;

  scene.add(fuse);
  fuse.traverse(function (node) {

    if (node.isMesh) {
      node.castShadow = true;
    }
  })

}, undefined, function (error) {

  console.error(error);

});



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
const planeGeometry = new THREE.PlaneGeometry(25, 25, 32, 32);
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


let speed = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

  // pour savoir si l'item est chargé ou non
  if (scene.children[3] != undefined) {
    let fuse = scene.children[3];
    fuse.position.set(0, speed += 0.1, 0);

    if (fuse.position.y >= 15) {
      fuse.position.set(0, 0, 0);
    }
  }


  controls.update();
  stats.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onMouseDown( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  render();
}

function render() {

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
    
    console.log(intersects[i].object);

    if (intersects[i].object.name == "Rocket_Ship_Circle003_1") {
      console.log('test');
    }
	}

	renderer.render( scene, camera );

}

window.addEventListener( 'mousedown', onMouseDown );

window.requestAnimationFrame(render);
