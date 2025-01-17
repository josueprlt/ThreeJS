// // Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
// let classifier;

// // A variable to hold the image we want to classify
// let capture;

// // Variables for displaying the results on the canvas
// let label = "";
// let confidence = "";

// function preload() {
//   classifier = ml5.imageClassifier("MobileNet");
//   // img = loadImage("images/dragon.avif");
// }


// function setup() {
//   createCanvas(400, 400);

//   // Paramètres de la caméra
//   let constraints = {
//     audio: false,
//     video: {
//       facingMode: "environment" // Caméra arrière par défaut
//     }
//   };

//   // Essayons d'accéder à la caméra arrière, et on bascule si nécessaire
//   capture = createCapture(constraints, function (stream) {
//     console.log("Caméra initialisée !");
//   });

//   // Si la caméra arrière n'existe pas, on bascule vers la caméra frontale
//   capture.elt.onloadedmetadata = function () {
//     if (!capture.elt.srcObject) {
//       constraints.video.facingMode = "user";
//       capture = createCapture(constraints);
//     }
//   };

//   capture.size(displayWidth, displayHeight);
//   capture.hide();

//   classifier.classifyStart(capture, gotResult);
//   image(capture, 0, 0, width, height);
// }

// function draw() {
//   image(capture, 0, 0, width, height);

//   fill(0);
//   textSize(32);
//   text(label, 20, 50);
// }

// // Callback function for when classification has finished
// function gotResult(results) {
//   // The results are in an array ordered by confidence
//   label = results[0].label;
// }


// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let video;

// Variables for displaying the results on the canvas
let label = "";
let confidence = "";

function preload() {
  classifier = ml5.imageClassifier("MobileNet");
  video = createVideo("video/elephant.mp4");
}


function setup() {
  createCanvas(400, 400);

  classifier.classifyStart(video, gotResult);
}

function draw() {
  video.play();
  video.loop();
  image(video, 0, 0, width, height);
  
  fill(0);
  textSize(32);
  text(label, 20, 50);
}

// Callback function for when classification has finished
function gotResult(results) {
  // The results are in an array ordered by confidence
  label = results[0].label;
}