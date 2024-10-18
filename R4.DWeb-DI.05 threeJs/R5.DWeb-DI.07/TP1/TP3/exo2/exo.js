import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import Particle from "./Particle.js";

gsap.registerPlugin(CustomEase);

const gui = new GUI();
const params = {
    showHelpers: true,
}
gui.add(params, 'showHelpers').name('Show Helpers');



const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
scene.background = new THREE.Color(0x9eaeff)

const container = document.querySelector('#container');
const stats = new Stats();
container.appendChild(stats.dom);

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5)
scene.add(lightAmbient);

const lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8)
lightDirectional.target.position.set(0, 0, 0);
scene.add(lightDirectional);
const dlightHelper = new THREE.DirectionalLightHelper(lightDirectional, 1);
scene.add(dlightHelper);

// Move the light source towards us
lightDirectional.position.set(20, 50, 10);
lightDirectional.castShadow = true;
const camHelper = new THREE.CameraHelper(lightDirectional.shadow.camera);
lightDirectional.shadow.camera.near = 5;
lightDirectional.shadow.camera.far = 200;
lightDirectional.shadow.camera.left = 100;
lightDirectional.shadow.camera.right = -100;
lightDirectional.shadow.camera.top = 100;
lightDirectional.shadow.camera.bottom = -100;
lightDirectional.shadow.biais = -0.001;
lightDirectional.shadow.mapSize.width = 4000;
lightDirectional.shadow.mapSize.height = 4000;

//Plan horizontal
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);
const gridHelper = new THREE.GridHelper(100, 40,);
scene.add(gridHelper);




const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Helpers
const center = (group) => {
    new THREE.Box3().setFromObject(group).getCenter(group.position).multiplyScalar(-1)
    scene.add(group)
}

const random = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min

    if (float) {
        return val
    }

    return Math.floor(val)
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })

const render = () => {
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera)
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 20;
camera.position.y = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})


// Fog
// scene.fog = new THREE.Fog(0xe0e0e0, 5, 100)


function spawnRandomParticule(pos) {
    let speedFactor = 0.1
    let vel = new THREE.Vector3(
        speedFactor * (Math.random() * 2.0 - 1.0),
        speedFactor * (Math.random() * 5.0),
        speedFactor * (Math.random() * 2.0 - 1.0)
    );

    let particule = new Particle(pos, vel, sphereGeometry);
    return particule;
}


scene.add(camHelper);

const sphereGeometry = new THREE.SphereGeometry();
let emitterPos = new THREE.Vector3(0, 0, 0);


let particules = [];


let clock = new THREE.Clock();

gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlightHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;

    let deltaTime = clock.getDelta();

    for (let i = 0; i < 20; i++) {
        let particule = spawnRandomParticule(emitterPos);
        scene.add(particule.mesh);
        particules.push(particule);
    }

    for (let i = particules.length - 1; i >= 0; i--) {
        particules[i].update(deltaTime);
        if (particules[i].finished()) {
            scene.remove(particules[i].mesh);
            particules.splice(i, 1);
        }

    }



    stats.update();
    controls.update();
    render()
})