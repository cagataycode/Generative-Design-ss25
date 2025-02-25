const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes/1000.json");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);

  return ({ context, width, height }) => {
    context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);

    context.lineWidth = 4;

    for (let x = 0; x <= width; x += 20) {
      let startY = random.range(0, height / 2);
      let endY = startY + random.range(height / 2, height);
      drawWavyLine(context, x, startY, endY, random.pick(palette));
    }
  };
};

function drawWavyLine(context, x, startY, endY, color) {
  let step = 20;
  let currentY = startY;

  context.strokeStyle = color;

  while (currentY < endY) {
    let nextY = Math.min(currentY + step, endY);
    let offsetX = random.range(-3, 3);
    context.beginPath();
    context.moveTo(x + offsetX, currentY);
    context.lineTo(x + offsetX, nextY);
    context.stroke();
    currentY = nextY;
  }
}

canvasSketch(sketch, settings);
