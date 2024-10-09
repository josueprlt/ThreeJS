const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let balls = [];

function setup() {
    createCanvas(windowWidth, windowHeight);


    for (let i = 0; i < 20; i++) {
        let segments = Math.random() * 10 + 10;
        let radius = Math.random() * 50 + 4;
        balls.push(new Ball(Math.random() * windowWidth, Math.random() * windowHeight, segments, radius));
    }
}


function mousePressed() {
    for (let ball of balls) {
        for (const m of ball.masses) {
            let d = m.position.copy();
            d.sub(createVector(mouseX, mouseY));
            d.normalize();
            d.mult(100);
            m.velocity.sub(d)
        }
    }
}


function draw() {
    background(255);

    for (let ball of balls) {
        ball.updateMasses();
    }

    for (let ball of balls) {
        ball.checkCollisionWithBox(width / 2 - 100, height - 200, 200, 200);
    }

    for (let ball of balls) {
        ball.checkCollisionBalls(balls);
    }

    for (let ball of balls) {
        ball.updateSprings();
    }

    for (let ball of balls) {
        ball.display();
    }


    fill("white");
    rect(width / 2 - 100, height - 200, 200, 200)
}