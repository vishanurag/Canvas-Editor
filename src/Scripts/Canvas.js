 let canvas = document.getElementById("mainCanvas");
  let ctx = canvas.getContext("2d");
  let textElements = []; // Array to store text elements
  let fontSize = 20;
  let fontName = "Arial"; // Default font
  let defaultColor = "#000000";
  let isBold = false;
  let isItalic = false;
  let isDragging = false;
  let draggedElementIndex = null; // To track which text element is being dragged
  let posX = 50;
  let posY = 50;

  // Function to add text element to the array
  function addTextElement(text, font, color, x, y) {
    textElements.push({ text, font, color, x, y });
  }

  // Function to render all text elements on the canvas
  function renderAllElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render each text element
    textElements.forEach((element) => {
      ctx.font = element.font;
      ctx.fillStyle = element.color;
      ctx.fillText(element.text, element.x, element.y);
    });
  }

  // Update canvas when the form is submitted
  let updateCanvas = (text, tSize, color, x, y) => {
    fontSize = tSize;
    defaultColor = color;
    let canvasFont = `${isBold ? "bold " : ""}${isItalic ? "italic " : ""}${fontSize}px ${fontName}`;

    addTextElement(text, canvasFont, color, x, y);
    renderAllElements();
  };

  // Submit event to add text to canvas
  let userForm = document.getElementById("userForm");
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let textVal = e.target.textData.value;
    let textSize = parseInt(e.target.tSize.value);
    let color = e.target.colorPicker.value;
    updateCanvas(textVal, textSize, color, posX, posY);
  });

  // Populate font sizes
  document.addEventListener("DOMContentLoaded", function () {
    let textSize = document.getElementById("textSize");
    for (let i = 10; i <= 72; i++) {
      let isSelected = i == 20 ? "selected" : "";
      let option = `<option value="${i}" ${isSelected}>${i}</option>`;
      textSize.innerHTML += option;
    }
  });

  // Canvas dimensions
  canvas.width = 400;
  canvas.height = 300;

  // Clear text function
  let clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", (e) => {
    e.preventDefault();
    textElements = [];
    renderAllElements();
  });

  // PDF download
  let downloadButton = document.getElementById("download");
  downloadButton.addEventListener("click", (e) => {
    e.preventDefault();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("canvas.pdf");
  });

  // Bold and Italic toggle buttons
  let boldButton = document.getElementById("bold");
  boldButton.addEventListener("click", (e) => {
    e.preventDefault();
    isBold = !isBold;
    renderAllElements();
  });

  let italicButton = document.getElementById("italic");
  italicButton.addEventListener("click", (e) => {
    e.preventDefault();
    isItalic = !isItalic;
    renderAllElements();
  });

  // Background color change
  let bgColorPicker = document.getElementById("bgColorPicker");
  bgColorPicker.addEventListener("input", function () {
    const bgColor = bgColorPicker.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderAllElements();
  });

  // Background image upload
  let bgImageUpload = document.getElementById("bgImageUpload");
  bgImageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Invalid file. Please upload a valid image under 5MB.");
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderAllElements();
      };
    };
    reader.readAsDataURL(file);
  });

  // Shape drawing functions
  const drawRectangle = (x, y) => ctx.fillRect(x - 50, y - 25, 100, 50);
  const drawCircle = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };
  const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  document.getElementById("rectangleBtn").addEventListener("click", (e) => {
    e.preventDefault();
    drawRectangle(posX, posY);
  });

  document.getElementById("circleBtn").addEventListener("click", (e) => {
    e.preventDefault();
    drawCircle(posX, posY);
  });

  document.getElementById("lineBtn").addEventListener("click", (e) => {
    e.preventDefault();
    drawLine(posX, posY, posX + 50, posY + 50);
  });

  // GSAP animations
  window.onload = function () {
    gsap.from(".btn", { duration: 1, y: -50, opacity: 0, stagger: 0.2, ease: "bounce" });
    gsap.from("#mainCanvas", { duration: 2, scale: 0.5, opacity: 0, ease: "elastic.out(1, 0.3)" });
  };

  // Dragging feature for individual text elements
  canvas.addEventListener("mousedown", (e) => {
    const { offsetX, offsetY } = e;
    textElements.forEach((element, index) => {
      const textWidth = ctx.measureText(element.text).width;
      const textHeight = fontSize;
      if (
        offsetX >= element.x &&
        offsetX <= element.x + textWidth &&
        offsetY >= element.y - textHeight &&
        offsetY <= element.y
      ) {
        isDragging = true;
        draggedElementIndex = index;
      }
    });
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDragging && draggedElementIndex !== null) {
      const { offsetX, offsetY } = e;
      textElements[draggedElementIndex].x
