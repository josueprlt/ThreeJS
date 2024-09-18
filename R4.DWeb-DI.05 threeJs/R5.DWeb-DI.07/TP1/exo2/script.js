// Au début du fichier
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let container, clock, mixer, gui, actions, activeAction, previousAction;
let model, face;

const api = { state: 'Idle' };

// Pour créer l’affichage en haut à droite
const stats = new Stats()
document.body.appendChild(stats.dom)

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xe0e0e0, 10, 45);
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
camera.position.set(0, 5, 10);
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

// Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5);
scene.add(lightAmbient);

let light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(50, 100, 50);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

light.position.set(5, 5, 5);

// Figure
class Figure extends THREE.Group {
    constructor() {
        super();
        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0
        };

        console.log(this.params.x + ' ' + this.params.z + ' ' + this.params.ry);

        clock = new THREE.Clock();

        this.position.x = this.params.x;
        this.position.y = this.params.y;
        this.position.z = this.params.z;

        let self = this;

        const loader = new GLTFLoader();
        loader.load('./RobotExpressive.glb', function (gltf) {

            self.add(gltf.scene);

            self.loadAnimation(gltf.scene, gltf.animations);

        }, undefined, function (e) {

            console.error(e);

        });
    }

    update(dt) {
        if (this.mixer) this.mixer.update(dt);
        this.position.set(this.params.x, this.params.y, this.params.z);
        this.rotation.set(0, this.params.ry, 0);
    }

    loadAnimation(model, animations) {

        const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
        const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];


        this.mixer = new THREE.AnimationMixer(model);

        this.actions = {};

        for (let i = 0; i < animations.length; i++) {

            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;

            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;

            }

        }

        this.state =  "Idle";
        this.actions[this.state].play();
    }

    fadeToAction(animationName, fadeDuration) {

        if (!this.actions) return;

        if (animationName === this.state) return;

        this.actions[this.state].fadeOut(fadeDuration);
        this.actions[animationName].reset()
                                   .fadeIn(fadeDuration)
                                   .play();

        this.state = animationName;
    }
}

const figure = new Figure();
scene.add(figure);

// Helpers
let DirectionalLightHelper = new THREE.DirectionalLightHelper(light);
let GridHelper = new THREE.GridHelper(40, 100);
const axesHelper = new THREE.AxesHelper(3);
const shadowHelper = new THREE.CameraHelper(light.shadow.camera);

scene.add(DirectionalLightHelper);
scene.add(GridHelper);
scene.add(axesHelper);
scene.add(shadowHelper);


var isAnimating = false;
var isAnimatingWalk = false;
var ry = 0;
var x = 0;
var z = 0;
var walkSpeed = 0.2;


let keySpaceIsDown = false;
let keyAIsDown = false;
let keyDIsDown = false;
let keyWIsDown = false;
let keySIsDown = false;
let keyEIsDown = false;
let keyQIsDown = false;

window.addEventListener("keyup", (event) => {

    if (event.code === 'Space') {
        keySpaceIsDown = false;
    }

    if (event.code === 'KeyA') {
        keyAIsDown = false;
    }

    if (event.code === 'KeyD') {
        keyDIsDown = false;
    }

    if (event.code === 'KeyW') {
        keyWIsDown = false;
    }

    if (event.code === 'KeyS') {
        keySIsDown = false;
    }

    if (event.code === 'KeyE') {
        keyEIsDown = false;
    }

    if (event.code === 'KeyQ') {
        keyQIsDown = false;
    }
})

window.addEventListener("keydown", (event) => {

    if (event.code === 'Space') {
        keySpaceIsDown = true;
    }

    if (event.code === 'KeyA') {
        keyAIsDown = true;
    }

    if (event.code === 'KeyD') {
        keyDIsDown = true;
    }

    if (event.code === 'KeyW') {
        keyWIsDown = true;
    }

    if (event.code === 'KeyS') {
        keySIsDown = true;
    }

    if (event.code === 'KeyE') {
        keyEIsDown = true;
    }

    if (event.code === 'KeyQ') {
        keyQIsDown = true;
    }
})


gsap.ticker.add(() => {

    if (keySpaceIsDown && !isAnimating) {
        /* activeAction = actions['Idle'];
        activeAction.play(); */
    }

    if (keyAIsDown) {
        ry += 0.1;
        gsap.to(figure.params, { ry: ry });
    }

    if (keyDIsDown) {
        ry -= 0.1;
        gsap.to(figure.params, { ry: ry });
    }
    
    if (keyWIsDown) {
        x = x + walkSpeed * Math.sin(figure.params.ry);
        z = z + walkSpeed * Math.cos(figure.params.ry);
        gsap.to(figure.params, { x: x, z: z});
        figure.fadeToAction("Running", 0.25);
    }
    else if (keySIsDown) {
        x = x - walkSpeed * Math.sin(figure.params.ry);
        z = z - walkSpeed * Math.cos(figure.params.ry);
        gsap.to(figure.params, { x: x, z: z});
        figure.fadeToAction("Running", 0.25);
    }
    else if (keyEIsDown) {
        figure.fadeToAction("Dance", 0.25);
    }
    else if (keyQIsDown) {
        figure.fadeToAction("Sitting", 0.25);
    }
    else {
        figure.fadeToAction("Idle", 0.25);
    }
    
    // positionnement
    const localCameraPosition = new THREE.Vector3(-15, 5, -25);
    figure.localToWorld(localCameraPosition);
    camera.position.copy(localCameraPosition);

    // quoi regarder
    camera.lookAt(new THREE.Vector3(figure.position.x, 5, figure.position.z));
    
    // maj des matrices
    camera.updateProjectionMatrix();


    const dt = clock.getDelta();
    figure.update(dt);
    controls.update();
    stats.update();
    render();
});