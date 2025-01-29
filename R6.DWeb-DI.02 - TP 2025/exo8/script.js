let data = [];
let classifier;
let label = "training...";
let confidence = "training...";
let handPose;
let video;
let hands = [];
let rockState = 0;
let paperState = 0;
let scissorState = 0;
let rockButton, paperButton, scissorsButton, trainButton, saveButton, loadButton;

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Initialize the neural network
  let options = {
    task: "classification",
    debug: true,
  };
  classifier = ml5.neuralNetwork(options);

  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  // Create buttons for training
  rockButton = createButton(`Rock: ${rockState}`);
  rockButton.position(10, height + 10);
  rockButton.mousePressed(() => addData('rock'));

  paperButton = createButton(`Paper: ${paperState}`);
  paperButton.position(70, height + 10);
  paperButton.mousePressed(() => addData('paper'));

  scissorsButton = createButton(`Scissors: ${scissorState}`);
  scissorsButton.position(140, height + 10);
  scissorsButton.mousePressed(() => addData('scissors'));

  trainButton = createButton('Train');
  trainButton.position(220, height + 10);
  trainButton.mousePressed(trainModel);

  saveButton = createButton('Save Model');
  saveButton.position(290, height + 10);
  saveButton.mousePressed(() => classifier.save());
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }

  // Display the gesture label
  fill(255, 0, 0);
  textSize(32);
  text(label, 10, height - 40);
  text(confidence, 10, height - 10);
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
  classify();
}

// Add data to the classifier
function addData(gesture) {
  if (hands.length > 0) {
    let hand = hands[0];
    let inputs = hand.keypoints.map(p => [p.x, p.y]).flat();
    classifier.addData(inputs, [gesture]);
    console.log(`Added data for ${gesture}`);
    if (gesture === 'rock') {
      rockState++;
      rockButton.html(`Rock: ${rockState}`);
    } else if (gesture === 'paper') {
      paperState++;
      paperButton.html(`Paper: ${paperState}`);
    } else if (gesture === 'scissors') {
      scissorState++;
      scissorsButton.html(`Scissors: ${scissorState}`);
    }
  }
}

// Train the model
function trainModel() {
  classifier.normalizeData();
  classifier.train({ epochs: 50 }, () => {
    console.log('Training complete');
    classify();
  });
}

// Classify the current hand gesture
function classify() {
  if (hands.length > 0) {
    let hand = hands[0];
    let inputs = hand.keypoints.map(p => [p.x, p.y]).flat();
    classifier.classify(inputs, (error, results) => {
      label = error[0].label;
      confidence = error[0].confidence;
    });
  }
}

// Callback function for when the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  classify();
}
