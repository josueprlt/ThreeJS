let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Use the createCapture() function to access the device's
  // camera and start capturing video.
  capture = createCapture(VIDEO);

  // Make the capture frame half of the canvas.
  capture.size(width, height);

  // Use capture.hide() to remove the p5.Element object made
  // using createCapture(). The video will instead be rendered as
  // an image in draw().
  capture.hide();
}

function draw() {
  // Set the background to gray.
  background(255);

  let gridSize = 10

//   translate(width,0);
//   scale(-1, 1);
  capture.loadPixels();
  for (let y = 0; y < capture.height; y+=gridSize) {
    for (let x = 0; x < capture.width; x+=gridSize) {

        let index = (y * capture.width + (capture.width - x - 1)) * 4;
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];
        let lum = (r + b + g) / 3;
        let dia = map(lum, 0 , 255, gridSize, 0)

        fill(r, g, b);
        noStroke();
        circle(x + gridSize/2, y + gridSize/2, dia);
    }    
  }
}