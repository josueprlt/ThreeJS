const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let masses =  [];

function setup() {
	createCanvas(windowWidth, windowHeight);

    /* let x = random(0, windowWidth);
    let y = random(0, windowHeight); */

    for (let i = 0; i < 10; i++) {
        masses.push(new Mass(Math.random() * windowWidth, Math.random() * windowHeight));
    }
}


function draw() {
    background(255);
    
    for (const m of masses) {
        m.updatePosition();
    }

    for (const m of masses) {
        m.display();
    }
}
