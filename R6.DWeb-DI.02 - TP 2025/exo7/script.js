let video;
let bodyPose;
let poses = [];
let connections;
let balle;
let leftPlaque;
let rightPlaque;

class Balle {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 10;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Collision avec les bords supérieur et inférieur
    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.vy *= -1;
    }

    // Collision avec les plaques
    if (this.x - this.radius < leftPlaque.x + leftPlaque.width && this.y > leftPlaque.y && this.y < leftPlaque.y + leftPlaque.height) {
      this.vx *= -1;
    }
    if (this.x + this.radius > rightPlaque.x && this.y > rightPlaque.y && this.y < rightPlaque.y + rightPlaque.height) {
      this.vx *= -1;
    }

    // Collision avec les bords gauche et droit
    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.reset();
    }
  }

  draw() {
    fill(255);
    noStroke();
    circle(this.x, this.y, this.radius * 2);
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
  }
}

class Plaque {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
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

  // Initialiser la balle avec une position et une vitesse aléatoires
  balle = new Balle(width / 2, height / 2, random(-3, 3), random(-3, 3));

  // Initialiser les plaques
  leftPlaque = new Plaque(10, height / 2 - 50, 10, 100);
  rightPlaque = new Plaque(width - 20, height / 2 - 50, 10, 100);
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

    // Déplacer les plaques en fonction de la position du poignet gauche
    let leftWrist = pose.keypoints.find(k => k.name === 'left_wrist');
    if (leftWrist && leftWrist.confidence > 0.1) {
      leftPlaque.y = leftWrist.y - leftPlaque.height / 2;
    }

    let rightWrist = pose.keypoints.find(k => k.name === 'right_wrist');
    if (rightWrist && rightWrist.confidence > 0.1) {
      rightPlaque.y = rightWrist.y - rightPlaque.height / 2;
    }
  }

  // Mettre à jour et dessiner la balle
  balle.update();
  balle.draw();

  // Dessiner les plaques
  leftPlaque.draw();
  rightPlaque.draw();
}

// Callback pour les résultats des poses
function gotPoses(results) {
  poses = results;
}