const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [800, 800],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 50;

    const numCircles = 50; // Number of concentric circles
    const radiusStep = maxRadius / numCircles;

    for (let i = 0; i < numCircles; i++) {
      const radius = radiusStep * (i + 1);
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      context.strokeStyle = `rgba(0, 0, 0, ${0.5 + 0.5 * Math.sin(i)})`; // Varying opacity
      context.lineWidth = 2;
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
