// Daniel Shiffman
// http://codingtra.in

// Simple Particle System
// https://youtu.be/UcdigVaIYAk

const particles = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

let frame = 0;

function draw() {
  frame++;
  background(0);
  for (let i = 0; i < 5; i++) {
    let p = new Particle();
    particles.push(p);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

class Particle {

  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    let angleRad = frame / 6.0;
    this.vx = random(0, 10) * cos(angleRad);
    this.vy = random(0, 10) * sin(angleRad);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    let wind = 2;
    this.x += this.vx + wind;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    // noStroke();
    let l = this.alpha;
    stroke(255 - l, 204 - l, 0 - l, this.alpha + 50);
    fill(255 - l, 204 - l, 0 - l, this.alpha);
    ellipse(this.x, this.y, 16);
  }

}