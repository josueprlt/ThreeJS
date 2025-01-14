// Step 1: load data or create some data
const data = [
    { taille: 82, poids: 14, age: 10, animal: "chat" },
    { taille: 80, poids: 23, age: 10, animal: "chien" },
    { taille: 43, poids: 24, age: 13, animal: "chien" },
    { taille: 45, poids: 39, age: 10, animal: "chien" },
    { taille: 53, poids: 20, age: 10, animal: "chien" },
    { taille: 54, poids: 23, age: 6, animal: "chat" },
    { taille: 37, poids: 15, age: 1, animal: "chat" },
    { taille: 59, poids: 45, age: 12, animal: "chien" },
    { taille: 61, poids: 25, age: 5, animal: "chat" },
    { taille: 68, poids: 35, age: 13, animal: "chien" },
    { taille: 49, poids: 22, age: 4, animal: "chat" },
    { taille: 70, poids: 41, age: 8, animal: "chien" },
    { taille: 42, poids: 18, age: 3, animal: "chat" },
    { taille: 77, poids: 50, age: 7, animal: "chien" },
    { taille: 56, poids: 26, age: 6, animal: "chat" },
    { taille: 64, poids: 33, age: 9, animal: "chien" },
    { taille: 38, poids: 16, age: 2, animal: "chat" },
    { taille: 72, poids: 47, age: 11, animal: "chien" },
    { taille: 55, poids: 21, age: 4, animal: "chat" },
    { taille: 67, poids: 38, age: 8, animal: "chien" },
    { taille: 47, poids: 20, age: 3, animal: "chat" },
    { taille: 78, poids: 48, age: 9, animal: "chien" },
    { taille: 50, poids: 22, age: 5, animal: "chat" },
    { taille: 65, poids: 36, age: 7, animal: "chien" },
    { taille: 39, poids: 17, age: 2, animal: "chat" },
    { taille: 74, poids: 44, age: 10, animal: "chien" },
    { taille: 58, poids: 25, age: 6, animal: "chat" },
    { taille: 69, poids: 40, age: 8, animal: "chien" },
    { taille: 41, poids: 19, age: 3, animal: "chat" },
    { taille: 75, poids: 46, age: 9, animal: "chien" },
    { taille: 52, poids: 23, age: 5, animal: "chat" },
    { taille: 66, poids: 37, age: 7, animal: "chien" },
    { taille: 40, poids: 18, age: 2, animal: "chat" },
    { taille: 71, poids: 43, age: 11, animal: "chien" },
    { taille: 57, poids: 24, age: 6, animal: "chat" },
    { taille: 63, poids: 32, age: 8, animal: "chien" },
    { taille: 44, poids: 20, age: 3, animal: "chat" },
    { taille: 76, poids: 49, age: 9, animal: "chien" },
    { taille: 51, poids: 22, age: 5, animal: "chat" },
    { taille: 62, poids: 30, age: 7, animal: "chien" },
    { taille: 48, poids: 21, age: 4, animal: "chat" },
    { taille: 73, poids: 45, age: 10, animal: "chien" },
    { taille: 60, poids: 26, age: 6, animal: "chat" },
    { taille: 68, poids: 34, age: 8, animal: "chien" },
    { taille: 46, poids: 19, age: 3, animal: "chat" },
    { taille: 79, poids: 50, age: 9, animal: "chien" },
    { taille: 53, poids: 23, age: 5, animal: "chat" },
    { taille: 64, poids: 31, age: 7, animal: "chien" },
    { taille: 42, poids: 18, age: 2, animal: "chat" },
    { taille: 70, poids: 42, age: 8, animal: "chien" }
];


let classifer;
let label = "training";

function setup() {
    createCanvas(640, 240);

    // For this example to work across all browsers
    // "webgl" or "cpu" needs to be set as the backend
    ml5.setBackend("webgl");

    // Step 2: set your neural network options
    let options = {
        task: "regression",
        debug: true,
    };

    // Step 3: initialize your neural network
    classifier = ml5.neuralNetwork(options);

    // Step 4: add data to the neural network
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let inputs = [item.taille, item.animal, item.age];
        let outputs = [item.animal];
        classifier.addData(inputs, outputs);
    }

    // Step 5: normalize your data;
    classifier.normalizeData();

    // Step 6: train your neural network
    const trainingOptions = {
        epochs: 100,
        batchSize: 12,
    };
    classifier.train(trainingOptions, finishedTraining);
}
// Step 7: use the trained model
function finishedTraining() {
    predict();
}

// Step 8: make a classification
function predict() {
    const input = [67, "chien", 12];
    classifier.predict(input, gotResults);
}

function draw() {
    background(200);
    textAlign(CENTER, CENTER);
    textSize(64);
    text(label, width / 2, height / 2);
}

// Step 9: define a function to handle the results of your classification
function gotResults(results, error) {
    if (error) {
        console.error(error);
        return;
    }
    console.log(results);
    label = results[0].value;
    // console.log(results); // {label: 'red', confidence: 0.8};
    predict();
}
