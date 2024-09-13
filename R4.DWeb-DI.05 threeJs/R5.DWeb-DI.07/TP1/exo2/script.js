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
class Figure {
    constructor() {

        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
            armRotation: 0,
            legRotation: 0
        };

        clock = new THREE.Clock();

        const loader = new GLTFLoader();
        loader.load('./RobotExpressive.glb', function (gltf) {

            model = gltf.scene;
            scene.add(model);
            model.position.set(figure.params.x, figure.params.y, figure.params.z);

            createGUI(model, gltf.animations);

        }, undefined, function (e) {

            console.error(e);

        });
    }
}

function createGUI(model, animations) {

    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    gui = new GUI();

    mixer = new THREE.AnimationMixer(model);

    actions = {};

    for (let i = 0; i < animations.length; i++) {

        const clip = animations[i];
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;

        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

        }

    }

    // states

    const statesFolder = gui.addFolder('States');

    const clipCtrl = statesFolder.add(api, 'state').options(states);

    clipCtrl.onChange(function () {

        fadeToAction(api.state, 0.5);

    });

    statesFolder.open();

    // emotes

    const emoteFolder = gui.addFolder('Emotes');

    function createEmoteCallback(name) {

        api[name] = function () {

            fadeToAction(name, 0.2);

            mixer.addEventListener('finished', restoreState);

        };

        emoteFolder.add(api, name);

    }

    function restoreState() {

        mixer.removeEventListener('finished', restoreState);

        fadeToAction(api.state, 0.2);

    }

    for (let i = 0; i < emotes.length; i++) {

        createEmoteCallback(emotes[i]);

    }

    emoteFolder.open();

    // expressions

    face = model.getObjectByName('Head_4');

    const expressions = Object.keys(face.morphTargetDictionary);
    const expressionFolder = gui.addFolder('Expressions');

    for (let i = 0; i < expressions.length; i++) {

        expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);

    }

    activeAction = actions['Idle'];
    activeAction.play();

    expressionFolder.open();

}

function fadeToAction(name, duration) {

    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {

        previousAction.fadeOut(duration);

    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();

}

const figure = new Figure();

// Helpers
let DirectionalLightHelper = new THREE.DirectionalLightHelper(light);
let GridHelper = new THREE.GridHelper(40, 100);
const axesHelper = new THREE.AxesHelper(3);
const shadowHelper = new THREE.CameraHelper(light.shadow.camera);

scene.add(DirectionalLightHelper);
scene.add(GridHelper);
scene.add(axesHelper);
scene.add(shadowHelper);

// GSAP Animation
/* gsap.set(figure.params, {
    y: 1.35
});

gsap.to(figure.params, {
    ry: degreesToRadians(360),
    repeat: -1,
    duration: 20
});

gsap.to(figure.params, {
    y: 3,
    armRotation: degreesToRadians(90),
    repeat: -1,
    yoyo: true,
    duration: 0.5
}); */


var isAnimating = false;
var isAnimatingWalk = false;
var ry = 0;
var x = 0;
var z = 0;
var walkSpeed = 0.1;


let keySpaceIsDown = false;
let keyAIsDown = false;
let keyDIsDown = false;
let keyWIsDown = false;
let keySIsDown = false;
let keyEIsDown = false;

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
})


gsap.ticker.add(() => {

    if (keySpaceIsDown && !isAnimating) {
        isAnimating = true;
        tl2.pause(0);
        tl.restart();
    }

    if (keyAIsDown) {
        ry += 5;
        gsap.to(figure.params, { ry: degreesToRadians(ry), onUpdate: () => figure.bounce() });
    }

    if (keyDIsDown) {
        ry -= 5;
        gsap.to(figure.params, { ry: degreesToRadians(ry), onUpdate: () => figure.bounce() });
    }

    if (keyWIsDown) {
        x = x + walkSpeed * Math.sin(figure.params.ry);
        z = z + walkSpeed * Math.cos(figure.params.ry);
    }

    if (keySIsDown) {
        x = x - walkSpeed * Math.sin(figure.params.ry);
        z = z - walkSpeed * Math.cos(figure.params.ry);
        gsap.to(figure.params, { x: x, z: z, onUpdate: () => figure.walkSpeed() });

        if (!isAnimatingWalk) {
            isAnimatingWalk = true;
            tl.pause(0);
            tl2.restart();
        }
    }

    if (keyEIsDown) {
        console.log('test');
    }

    // console.log(api.state);
    console.log(figure.params.x);
    
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    controls.update();
    stats.update();
    render();
});