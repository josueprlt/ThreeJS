const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let masses = [];
let springs = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

    let m1 = new Mass(100, 100);
    let m2 = new Mass(200, 100);
    let m3 = new Mass(200, 200);
    let m4 = new Mass(200, 300);
    springs.push(new Spring(m1, m2));
    springs.push(new Spring(m2, m3));
    springs.push(new Spring(m3, m4));
    springs.push(new Spring(m4, m1));

    
}


function draw() {
    background(255);

    for (const m of masses) {
        m.updatePosition();
        m.display();
    }

    for (const s of springs) {
        s.applyConstraint();
        s.display();
    }
}
