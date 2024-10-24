// Au début du fichier
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Mass from "./Mass.js";
import Spring from "./Spring.js";

// Pour créer l’affichage en haut à droite
const stats = new Stats()
document.body.appendChild(stats.dom)

const scene = new THREE.Scene()
// scene.fog = new THREE.Fog(0xe0e0e0, 10, 45);
scene.background = new THREE.Color(0xe0e0e0);

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Helpers
const center = (group) => {
    new THREE.Box3().setFromObject(group).getCenter(group.position).multiplyScalar(-1);
    scene.add(group);
}

const random = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min;

    if (float) {
        return val;
    }
    return Math.floor(val);
}

// Plane
const planeGeometry = new THREE.PlaneGeometry(150, 150);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.set(Math.PI * -0.5, 0, 0);
scene.add(plane);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(10, 10, 15);
camera.lookAt(0, 0, 0);
scene.add(camera);

/**
 * Renderer
 */
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const render = () => {
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
});

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5);
scene.add(lightAmbient);

let light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 40, 0);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

// Helpers
let DirectionalLightHelper = new THREE.DirectionalLightHelper(light);
let GridHelper = new THREE.GridHelper(40, 100);
const axesHelper = new THREE.AxesHelper(3);
const shadowHelper = new THREE.CameraHelper(light.shadow.camera);

scene.add(DirectionalLightHelper);
scene.add(GridHelper);
scene.add(axesHelper);
scene.add(shadowHelper);


const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    -5, 5, -5,
    5, 5, -5,
    5, 15, -5,
    -5, 15, -5,
    -5, 5, 5,
    5, 5, 5,
    5, 15, 5,
    -5, 15, 5,
]);
const indices = [
    2, 1, 0, 0, 3, 2,
    0, 4, 7, 7, 3, 0,
    0, 1, 5, 5, 4, 0,
    1, 2, 6, 6, 5, 1,
    2, 3, 7, 7, 6, 2,
    4, 5, 6, 6, 7, 4
];
geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const mat = new THREE.MeshPhongMaterial({ color: 0x156213, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

let mesh = new THREE.Mesh(geometry, mat);
mesh.castShadow = true;
scene.add(mesh);

let masses = [];
for (let i = 0; i < vertices.length; i+=3) {
    masses.push(new Mass(vertices[i], vertices[i+1], vertices[i+2]));
}

let springs = [];
for (let i = 0; i < masses.length; i++) {
    for (let j = i + 1; j < masses.length; j++) {
        springs.push(new Spring(masses[i], masses[j]));
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        let dir = new THREE.Vector3(Math.random() * 10 - 5, 10.0, Math.random() * 10 - 5);
        for (const m of masses) {
            m.velocity.add(dir);
        }
    }
});


gsap.ticker.add(() => {

    for (const m of masses) {
        m.updatePosition();
    }

    for (const s of springs) {
        s.applyConstraint();
    }

    /* for (const s of springs) {
        s.avoidExchange();
    } */

    let vertices = geometry.getAttribute('position').array;
    for (let i = 0; i < masses.length; i++) {
        vertices[i * 3] = masses[i].position.x;
        vertices[i * 3 + 1] = masses[i].position.y;
        vertices[i * 3 + 2] = masses[i].position.z;
    }
    

    geometry.computeVertexNormals();
    geometry.getAttribute('position').needsUpdate = true;

    controls.update();
    stats.update();
    render();
});

// GUI pour afficher ou masquer les helpers
const gui = new GUI();

const myObject = {
    showHelpers: true
};

gui.add(myObject, 'showHelpers').onChange(value => {
    if (value) {
        DirectionalLightHelper.visible = true;
        GridHelper.visible = true;
        axesHelper.visible = true;
        shadowHelper.visible = true;
    } else {
        DirectionalLightHelper.visible = false;
        GridHelper.visible = false;
        axesHelper.visible = false;
        shadowHelper.visible = false;
    }
});