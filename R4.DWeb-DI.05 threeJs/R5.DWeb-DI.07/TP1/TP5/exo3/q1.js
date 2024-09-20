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

    let radius = 100;
    let segments = 20;
    let centerX = Math.random() = windowWidth;
    let centerY = Math.random() = windowHeight;

    for (let i = 0; i < segments; i++) {
        let angle = i * (2.0 * Math.PI / segments);
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        masses.push(new Mass(x, y))
    }

    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            springs.push(new Spring(masses[i], masses[j]))
        }
        
    }

    for (let i = 0; i < 2; i++) {
        let m1 = new Mass(Math.random() * windowWidth, Math.random() * windowHeight);
        let m2 = new Mass(Math.random() * windowWidth, Math.random() * windowHeight);
        
        springs.push(new Spring(m1, m2));

        masses.push(m1);
        masses.push(m2);
    }
    
}

function mousePressed() {
    
    for (const m of masses) {
        let d = m.position.copy();
        d.sub(createVector(mouseX, mouseY));
        d.normalize();
        d.mult(100);
        m.velocity.sub();
    }
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
