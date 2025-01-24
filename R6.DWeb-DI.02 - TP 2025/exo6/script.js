let video;
let bodyPose;
let poses = [];
let connections;
let balles = [];
const gravity = 0.2;
const shootInterval = 50; // Intervalle de tir en millisecondes
let lastShootTime = 0;

class Balle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.vy += gravity; // Apply gravity to the vertical velocity
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    fill(255, 0, 0);
    noStroke();
    circle(this.x, this.y, 10);
  }
}

function preload() {
  // Charger le modèle bodyPose
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);

  // Capture vidéo
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // Détection des poses
  bodyPose.detectStart(video, gotPoses);

  // Récupération des connexions du squelette
  connections = bodyPose.getSkeleton();
}

function draw() {
  image(video, 0, 0, width, height);

  // Afficher les connexions du squelette
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < connections.length; j++) {
      let pointAIndex = connections[j][0];
      let pointBIndex = connections[j][1];
      let pointA = pose.keypoints[pointAIndex];
      let pointB = pose.keypoints[pointBIndex];
      console.log(pointA);
      console.log(pointB);
      
      if (pointA.confidence > 0.1 && pointA.name === "left_elbow" && pointB.confidence > 0.1 && pointB.name === "left_wrist") {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(width - pointA.x, pointA.y, width - pointB.x, pointB.y);
      }
      if (pointA.confidence > 0.1 && pointA.name === "right_elbow" && pointB.confidence > 0.1 && pointB.name === "right_wrist") {
        stroke(255, 0, 0);
        strokeWeight(2);
        line(width - pointA.x, pointA.y, width - pointB.x, pointB.y);
      }
    }
  }

  // Afficher les points du squelette
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      
      if (keypoint.confidence > 0.1 && keypoint.name === 'left_wrist' || keypoint.confidence > 0.1 && keypoint.name === 'left_elbow') {
        fill(0, 255, 0);
        noStroke();
        circle(width - keypoint.x, keypoint.y, 10);
      }
      if (keypoint.confidence > 0.1 && keypoint.name === 'right_wrist' || keypoint.confidence > 0.1 && keypoint.name === 'right_elbow') {
        fill(0, 255, 0);
        noStroke();
        circle(width - keypoint.x, keypoint.y, 10);
      }
    }

    // Gestion des tirs (poignets et coudes)
    let leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
    let leftElbow = pose.keypoints.find(k => k.name === 'left_elbow');
    let rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
    let rightElbow = pose.keypoints.find(k => k.name === 'right_elbow');

    let currentTime = millis();
    if (currentTime - lastShootTime > shootInterval) {
      if (leftWrist && leftWrist.confidence > 0.1 && leftElbow && leftElbow.confidence > 0.1) {
        let vx = (leftWrist.x - leftElbow.x) * 0.1;
        let vy = (leftWrist.y - leftElbow.y) * 0.1;
        balles.push(new Balle(width - leftWrist.x, leftWrist.y, -vx, vy));
      }
      if (rightWrist && rightWrist.confidence > 0.1 && rightElbow && rightElbow.confidence > 0.1) {
        let vx = (rightWrist.x - rightElbow.x) * 0.1;
        let vy = (rightWrist.y - rightElbow.y) * 0.1;
        balles.push(new Balle(width - rightWrist.x, rightWrist.y, -vx, vy));
      }
      lastShootTime = currentTime;
    }
  }

  // Update and draw all the balls
  for (let i = balles.length - 1; i >= 0; i--) {
    balles[i].update();
    balles[i].draw();
    // Remove balls that go off screen
    if (balles[i].x < 0 || balles[i].x > width || balles[i].y < 0 || balles[i].y > height) {
      balles.splice(i, 1);
    }
  }
}

// Callback pour les résultats des poses
function gotPoses(results) {
  poses = results;
}