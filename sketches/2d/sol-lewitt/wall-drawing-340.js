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
  const shapes = ["rectangle", "circle", "triangle"];
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

    // draw the selected shape with vertical lines
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

      // :O
    } else if (selectedShape === "triangle") {
      // Calculate triangle points
      const topX = centerX;
      const topY = centerY - size;
      const leftX = centerX - size * Math.cos(Math.PI / 6);
      const leftY = centerY + size * Math.sin(Math.PI / 6);
      const rightX = centerX + size * Math.cos(Math.PI / 6);
      const rightY = leftY;

      // Function to check if a point is inside the triangle
      const isInsideTriangle = (px, py) => {
        const v0x = rightX - leftX;
        const v0y = rightY - leftY;
        const v1x = topX - leftX;
        const v1y = topY - leftY;
        const v2x = px - leftX;
        const v2y = py - leftY;

        const dot00 = v0x * v0x + v0y * v0y;
        const dot01 = v0x * v1x + v0y * v1y;
        const dot02 = v0x * v2x + v0y * v2y;
        const dot11 = v1x * v1x + v1y * v1y;
        const dot12 = v1x * v2x + v1y * v2y;

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return u >= 0 && v >= 0 && u + v < 1;
      };

      // Draw the triangle
      context.beginPath();
      context.moveTo(topX, topY);
      context.lineTo(leftX, leftY);
      context.lineTo(rightX, rightY);
      context.closePath();
      context.stroke();

      // Draw vertical lines inside the triangle
      for (let x = Math.floor(leftX); x <= Math.ceil(rightX); x += 20) {
        let startY = null;
        let endY = null;

        for (let y = Math.floor(topY); y <= Math.ceil(leftY); y++) {
          if (isInsideTriangle(x, y)) {
            if (startY === null) startY = y;
            endY = y;
          } else if (startY !== null) {
            break;
          }
        }

        if (startY !== null && endY !== null) {
          context.moveTo(x, startY);
          context.lineTo(x, endY);
        }
      }
      context.stroke();

      // Triangle border
      context.strokeStyle = palette[2];
      context.beginPath();
      context.moveTo(topX, topY);
      context.lineTo(leftX, leftY);
      context.lineTo(rightX, rightY);
      context.closePath();
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
      } else if (selectedShape === "triangle") {
        const topY = centerY - size;
        const baseY = centerY + size * Math.sin(Math.PI / 6);
        if (y < topY || y > baseY) {
          context.moveTo(0, y);
          context.lineTo(width, y);
        } else {
          const progress = (y - topY) / (baseY - topY);
          const leftX = centerX - size * Math.cos(Math.PI / 6) * progress;
          const rightX = centerX + size * Math.cos(Math.PI / 6) * progress;
          context.moveTo(0, y);
          context.lineTo(leftX, y);
          context.moveTo(rightX, y);
          context.lineTo(width, y);
        }
      }
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
