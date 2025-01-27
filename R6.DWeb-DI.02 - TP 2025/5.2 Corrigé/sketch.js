/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

let video;
let bodyPose;
let poses = [];
let connections;

let raquetteDroite;
let raquetteGauche;
let ball;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose("BlazePose");
}

function setup() {
  createCanvas(640, 480);

  raquetteDroite = { y: height / 2, vy: 0 };
  raquetteGauche = { y: height / 2, vy: 0 };
  ball = { x: width / 2, y: height / 2, vx: 3, vy: 3 };

  // Create the video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  if (poses.length > 0) {
    let rW = poses[0].right_wrist;
    let rE = poses[0].right_elbow;
    let rS = poses[0].right_shoulder;
    console.log(rW, rE, rS);
    if (rW.confidence > 0.1 && rE.confidence > 0.1 &&
      rS.confidence > 0.1) {
      fill(0, 255, 0);
      noStroke();
      circle(width - rE.x, rE.y, 10);
      circle(width - rW.x, rW.y, 10);
      circle(width - rS.x, rS.y, 10);
      stroke(255, 0, 0);
      strokeWeight(2);
      line(width - rE.x, rE.y, width - rW.x, rW.y);
      line(width - rS.x, rS.y, width - rE.x, rE.y);

      let dWS = dist(rW.keypoint3D.x, rW.keypoint3D.y, rW.keypoint3D.z,
        rS.keypoint3D.x, rS.keypoint3D.y, rS.keypoint3D.z);
      let dWE = dist(rW.keypoint3D.x, rW.keypoint3D.y, rW.keypoint3D.z,
        rE.keypoint3D.x, rE.keypoint3D.y, rE.keypoint3D.z);
      let dES = dist(rE.keypoint3D.x, rE.keypoint3D.y, rE.keypoint3D.z,
        rS.keypoint3D.x, rS.keypoint3D.y, rS.keypoint3D.z);
      let ratio = map(dWS / (dWE + dES), 0.65, 1, -1, 1);
      console.log(ratio);
      raquetteDroite.vy = ratio * 3;
    }

    // Même calcul pour la raquette gauche
    let lW = poses[0].left_wrist;
    let lE = poses[0].left_elbow;
    let lS = poses[0].left_shoulder;
    console.log(lW, lE, lS);
    if (lW.confidence > 0.1 && lE.confidence > 0.1 &&
      lS.confidence > 0.1) {
      fill(0, 255, 0);
      noStroke();
      circle(width - lE.x, lE.y, 10);
      circle(width - lW.x, lW.y, 10);
      circle(width - lS.x, lS.y, 10);
      stroke(255, 0, 0);
      strokeWeight(2);
      line(width - lE.x, lE.y, width - lW.x, lW.y);
      line(width - lS.x, lS.y, width - lE.x, lE.y);

      let dWS = dist(lW.keypoint3D.x, lW.keypoint3D.y, lW.keypoint3D.z,
        lS.keypoint3D.x, lS.keypoint3D.y, lS.keypoint3D.z);
      let dWE = dist(lW.keypoint3D.x, lW.keypoint3D.y, lW.keypoint3D.z,
        lE.keypoint3D.x, lE.keypoint3D.y, lE.keypoint3D.z);
      let dES = dist(lE.keypoint3D.x, lE.keypoint3D.y, lE.keypoint3D.z,
        lS.keypoint3D.x, lS.keypoint3D.y, lS.keypoint3D.z);
      let ratio = map(dWS / (dWE + dES), 0.65, 1, -1, 1);
      console.log(ratio);
      raquetteGauche.vy = ratio * 3;
    }
  }

  raquetteDroite.y += raquetteDroite.vy;
  if (raquetteDroite.y < 0) {
    raquetteDroite.y = 0;
    raquetteDroite.vy = 0;
  }
  if (raquetteDroite.y > height - 100) {
    raquetteDroite.y = height - 100;
    raquetteDroite.vy = 0;
  }
  fill(0, 0, 255);
  noStroke();
  rect(width - 20, raquetteDroite.y, 20, 100);

  raquetteGauche.y += raquetteGauche.vy;
  if (raquetteGauche.y < 0) {
    raquetteGauche.y = 0;
    raquetteGauche.vy = 0;
  }
  if (raquetteGauche.y > height - 100) {
    raquetteGauche.y = height - 100;
    raquetteGauche.vy = 0;
  }
  fill(0, 0, 255);
  noStroke();
  rect(0, raquetteGauche.y, 20, 100);

  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y < 0 || ball.y > height) {
    ball.vy *= -1;
  }
  if (ball.x < 20 && ball.y > raquetteGauche.y && ball.y < raquetteGauche.y + 100) {
    ball.vx *= -1;
  }
  if (ball.x > width - 20 && ball.y > raquetteDroite.y && ball.y < raquetteDroite.y + 100) {
    ball.vx *= -1;
  }
  if (ball.x < 0 || ball.x > width) {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.vx = random(2, 4) * (random() > 0.5 ? 1 : -1);
    ball.vy = random(2, 4) * (random() > 0.5 ? 1 : -1);
  }
  fill(0, 0, 255);
  noStroke();
  circle(ball.x, ball.y, 20);
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
