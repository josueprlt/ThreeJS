// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

// Variables for displaying the results on the canvas
let label = "";
let confidence = "";

function preload() {
  classifier = ml5.imageClassifier("DarkNet");
  img = loadImage("images/dragon.avif");
}


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

//   classifier.classify(capture, gotResult);
//   image(capture, 0, 0, width, height);
// }

// function draw() {
//   image(capture, 0, 0, width, height);
// }


function setup() {
  createCanvas(400, 400);
  classifier.classify(img, gotResult);
  image(img, 0, 0, width, height);
}

// Callback function for when classification has finished
function gotResult(results) {
  // The results are in an array ordered by confidence
  console.log(results);

  // Display the results on the canvas
  fill(255);
  stroke(0);
  textSize(18);
  label = "Label: " + results[0].label;
  confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
  text(label, 10, 360);
  text(confidence, 10, 380);
}