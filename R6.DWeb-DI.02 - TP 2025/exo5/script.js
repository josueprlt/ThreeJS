// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let objectDetector;
let objects = [];
let detecting = false;
let img = null;



function preload() {
  img = loadImage('images/ikea2.avif');
  objectDetector = ml5.objectDetector('cocossd', modelReady);
}

function modelReady() {
  detecting = true;
  console.log('Model is ready!!!');
}

function setup() {
  createCanvas(img.width, img.height);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  } else {
    // The results are in an array ordered by confidence.
    console.log(results);
    objects = results;
  }
}


function draw() {
  image(img, 0, 0)
  if (!detecting) {
    return;
  }
  if (img != null) {
    objectDetector.detect(img, gotResult);
  }
  else {
    background(0);
  }

  for (let object of objects) {
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(20);
    text(object.label, object.x + 10, object.y + 20);
    textSize(16);
    text((object.confidence * 100).toFixed(2) + '%', object.x + 10, object.y + 40);
  }
}