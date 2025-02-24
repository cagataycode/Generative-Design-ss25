const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

random.setSeed(random.getRandomSeed());

const specificSeed = 272301;
random.setSeed(specificSeed);

// Define the sketch parameters
const settings = {
  dimensions: [2048, 2048],
  seed: specificSeed,
  //   seed: random.getSeed(),
};

console.log("Seed: ", settings.seed);

const sketch = () => {
  // Generate random points
  const points = [];
  for (let i = 0; i < 35; i++) {
    const x = random.range(0, settings.dimensions[0]);
    const y = random.range(0, settings.dimensions[1]);
    points.push([x, y]);
  }

  return ({ context, width, height }) => {
    // Set the background
    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, width, height);

    // Draw lines connecting points
    context.strokeStyle = "blue";
    context.lineWidth = 0.2;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        context.beginPath();
        context.moveTo(points[i][0], points[i][1]);
        context.lineTo(points[j][0], points[j][1]);
        context.stroke();
      }
    }

    // Draw white dots
    context.fillStyle = "white";
    for (let i = 0; i < points.length; i++) {
      context.beginPath();
      context.arc(points[i][0], points[i][1], 2, 0, Math.PI * 2);
      context.fill();
    }
  };
};

canvasSketch(sketch, settings);
