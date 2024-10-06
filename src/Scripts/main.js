const canvas = document.getElementById("paint-canvas");
const ctx = canvas.getContext("2d");
const canvasContainer = document.querySelector(".paint-canvas-container");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "pencil";
let currentColor = "#000000";
let currentLineWidth = 5;
let fillMode = false;

function resizeCanvas() {
  canvas.width = canvasContainer.clientWidth - 20;
  canvas.height = canvasContainer.clientHeight - 20;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  if (currentTool === "fill") {
    floodFill(e.offsetX, e.offsetY, currentColor);
  }
}

function draw(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentLineWidth;
  ctx.lineCap = "round";

  switch (currentTool) {
    case "pencil":
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;
    case "eraser":
      ctx.strokeStyle = "#ffffff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      break;
    case "line":
      ctx.putImageData(saveState, 0, 0);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      ctx.putImageData(saveState, 0, 0);
      ctx.beginPath();
      ctx.rect(lastX, lastY, e.offsetX - lastX, e.offsetY - lastY);
      if (fillMode) ctx.fill();
      ctx.stroke();
      break;
    case "circle":
      ctx.putImageData(saveState, 0, 0);
      ctx.beginPath();
      const radius = Math.sqrt(
        Math.pow(e.offsetX - lastX, 2) + Math.pow(e.offsetY - lastY, 2)
      );
      ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      if (fillMode) ctx.fill();
      ctx.stroke();
      break;
    case "triangle":
      ctx.putImageData(saveState, 0, 0);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.lineTo(lastX - (e.offsetX - lastX), e.offsetY);
      ctx.closePath();
      if (fillMode) ctx.fill();
      ctx.stroke();
      break;
    case "star":
      ctx.putImageData(saveState, 0, 0);
      drawStar(lastX, lastY, e.offsetX - lastX, e.offsetY - lastY);
      break;
  }
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
  saveState = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  if (fillMode) ctx.fill();
  ctx.stroke();
}

function floodFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const targetColor = getPixelColor(imageData, x, y);
  const fillColorRgb = hexToRgb(fillColor);

  if (colorsMatch(targetColor, fillColorRgb)) return;

  const pixelsToCheck = [x, y];
  while (pixelsToCheck.length > 0) {
    const y = pixelsToCheck.pop();
    const x = pixelsToCheck.pop();

    const currentColor = getPixelColor(imageData, x, y);
    if (colorsMatch(currentColor, targetColor)) {
      setPixelColor(imageData, x, y, fillColorRgb);

      pixelsToCheck.push(x + 1, y);
      pixelsToCheck.push(x - 1, y);
      pixelsToCheck.push(x, y + 1);
      pixelsToCheck.push(x, y - 1);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(imageData, x, y) {
  const index = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

function setPixelColor(imageData, x, y, color) {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color.r;
  imageData.data[index + 1] = color.g;
  imageData.data[index + 2] = color.b;
  imageData.data[index + 3] = 255;
}

function colorsMatch(color1, color2) {
  return (
    color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

resizeCanvas();
let saveState = ctx.getImageData(0, 0, canvas.width, canvas.height);

window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

document.querySelectorAll(".paint-toolbar button").forEach((button) => {
  button.addEventListener("click", function () {
    if (this.id === "fill-tool") {
      fillMode = !fillMode;
      this.classList.toggle("active");
    } else if (this.id !== "clear-canvas" && this.id !== "save-image") {
      document
        .querySelector(".paint-toolbar button.active")
        .classList.remove("active");
      this.classList.add("active");
      currentTool = this.id.replace("-tool", "");
    }
  });
});

document.getElementById("color-picker").addEventListener("input", (e) => {
  currentColor = e.target.value;
});

document.getElementById("line-width").addEventListener("input", (e) => {
  currentLineWidth = e.target.value;
});

document.getElementById("clear-canvas").addEventListener("click", () => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  saveState = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

document.getElementById("save-image").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "creative-canvas-drawing.png";
  link.href = canvas.toDataURL();
  link.click();
});


// image posting
// Select the canvas and context
const canvass = document.getElementById('paint-canvas');
const ctxx = canvas.getContext('2d');

// Set the canvas size (you can adjust the size as needed)
canvass.width = window.innerWidth - 20; 
canvass.height = window.innerHeight - 150; 

// Add event listener for image upload
document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                
                ctxx.drawImage(img, 0, 0, canvass.width, canvass.height);
            };
            img.src = e.target.result; 
        };
        reader.readAsDataURL(file); 
    }
});

let scale = 1; // Initial scale factor

function zoomCanvas(increase) {
    const canvas = document.getElementById('paint-canvas');
    scale += increase ? 0.1 : -0.1; // Increase or decrease the scale
    scale = Math.max(scale, 0.1); 
    canvas.style.transform = `scale(${scale})`; // Apply scale to the canvas
}

// Add event listeners to the zoom buttons
document.querySelector('.zoom-in').addEventListener('click', () => zoomCanvas(true)); // Zoom in
document.querySelector('.zoom-out').addEventListener('click', () => zoomCanvas(false)); // Zoom out
