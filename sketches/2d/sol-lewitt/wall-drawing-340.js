const canvasSketch = require("canvas-sketch");
const palettes = require("nice-color-palettes/1000.json");
const random = require("canvas-sketch-util/random");

random.setSeed(random.getRandomSeed());

const settings = {
  dimensions: [3072, 2048],
  seed: random.getSeed(),
};

console.log("Seed: ", settings.seed);

const sketch = () => {
  // pick a random palette
  const palette = palettes[Math.floor(Math.random() * palettes.length)];

  // select a shape
  const shapes = ["rectangle", "circle"];
  const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];

  return ({ context, width, height }) => {
    // clear the canvas with the first color of the palette
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);

    // define center
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) / 4;

    // select colors for lines
    const shapeLineColor = palette[1];
    const outsideLineColor = palette[2];

    // Set consistent linewidth for shape and border
    const lineWidth = 4;
    context.lineWidth = lineWidth;

    // Draw the selected shape with vertical lines
    context.strokeStyle = shapeLineColor;

    if (selectedShape === "rectangle") {
      context.beginPath();
      context.rect(centerX - size, centerY - size, size * 2, size * 2);
      for (let x = centerX - size; x <= centerX + size; x += 25) {
        context.moveTo(x, centerY - size);
        context.lineTo(x, centerY + size);
      }
      context.stroke();

      // rectangle border
      context.strokeStyle = palette[2];

      context.strokeRect(centerX - size, centerY - size, size * 2, size * 2);
    } else if (selectedShape === "circle") {
      context.beginPath();
      context.arc(centerX, centerY, size, 0, Math.PI * 2);
      for (let x = centerX - size; x <= centerX + size; x += 20) {
        const yOffset = Math.sqrt(size ** 2 - (x - centerX) ** 2);
        context.moveTo(x, centerY - yOffset);
        context.lineTo(x, centerY + yOffset);
      }
      context.stroke();

      // circle border
      context.strokeStyle = palette[1];

      context.beginPath();
      context.arc(centerX, centerY, size, 0, Math.PI * 2);
      context.stroke();
    }

    // draw horizontal lines outside the shape
    context.strokeStyle = outsideLineColor;
    context.lineWidth = 2; // background
    for (let y = 0; y < height; y += 12) {
      context.beginPath();
      if (selectedShape === "circle") {
        const xOffset = Math.sqrt(size ** 2 - (y - centerY) ** 2) || 0;
        if (y < centerY - size || y > centerY + size) {
          context.moveTo(0, y);
          context.lineTo(width, y);
        } else {
          context.moveTo(0, y);
          context.lineTo(centerX - xOffset, y);
          context.moveTo(centerX + xOffset, y);
          context.lineTo(width, y);
        }
      } else if (selectedShape === "rectangle") {
        if (y < centerY - size || y > centerY + size) {
          context.moveTo(0, y);
          context.lineTo(width, y);
        } else {
          context.moveTo(0, y);
          context.lineTo(centerX - size, y);
          context.moveTo(centerX + size, y);
          context.lineTo(width, y);
        }
      }
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
