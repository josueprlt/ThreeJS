const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let m1 =  null;
let m2 =  null;
let spring = null;

function setup() {
	createCanvas(windowWidth, windowHeight);


    m1 = new Mass(Math.random() * windowWidth, Math.random() * 100);
    m2 = new Mass(Math.random() * windowWidth, Math.random() * 100);

    spring = new Spring(m1, m2);
}


function draw() {
    background(255);

    m1.updatePosition();
    m2.updatePosition();
    spring.applyConstraint();


    m1.display();
    m2.display();
    spring.display();
}
