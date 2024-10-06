class SnapSortsClass {
    textVal;
    color;
    canvasFont;
    x;
    y;

    constructor(textVal, canvasFont, color, x, y) {
        this.textVal = textVal;
        this.canvasFont = canvasFont;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}

let print = (val) => {
    console.log(val);
};

let mainCanvas = document.getElementById('mainCanvas');
let textSize = document.getElementById('textSize');
let colorPicker = document.getElementById('colorPicker');
let userForm = document.getElementById('userForm');
let undo = document.getElementById('undoButton');
let redo = document.getElementById('redoButton');
let myCanvas = mainCanvas.getContext("2d");

for (let i = 10; i <= 72; i++) {
    let isSelected = (i == 20) ? 'selected' : '';
    textSize.innerHTML += `<option value="${i}" ${isSelected}>${i}</option>`;
}

const fontName = "Verdana, Geneva, Tahoma, sans-serif";
let fontSize = localStorage.getItem('font-size') || "20";
let defaultColor = localStorage.getItem('font-color') || "#000000";
let canvasFont = `${fontSize}px ${fontName}`;

const cWidth = mainCanvas.width;
const cHeight = mainCanvas.height;
let posX = localStorage.getItem('pos-x') || cWidth / 2 - 50;
let posY = localStorage.getItem('pos-y') || cHeight / 2;

let textVal = "Hello World";
let isDragging = false;

// New variables for bold and italic
let isBold = false;
let isItalic = false;

let firstElement = new SnapSortsClass("Hello World", canvasFont, defaultColor, posX, posY);
let SnapSorts = [firstElement];

let index = 0;

let addToSnapSorts = (textVal, font, defaultColor, x, y) => {
    let SnapElement = new SnapSortsClass(textVal, font, defaultColor, x, y);
    SnapSorts.push(SnapElement);
    index++;
};

let updateCanvas = (text, tSize, color, x, y) => {
    fontSize = tSize;
    defaultColor = color;
    // Update canvasFont to include bold and italic if selected
    canvasFont = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize}px ${fontName}`;

    myCanvas.clearRect(0, 0, cWidth, cHeight);
    myCanvas.font = canvasFont;
    myCanvas.fillStyle = defaultColor;
    myCanvas.fillText(text, x, y);

    localStorage.setItem('pos-x', x);
    localStorage.setItem('pos-y', y);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('font-color', defaultColor);
};

let updatePositions = (x, y) => {
    posX = x - 200;
    posY = y - 200;

    if (x >= cWidth) posX -= cWidth;
    if (y >= cHeight) posY -= cHeight;
    if (x < 0) posX += cWidth;
    if (y < 0) posY += cHeight;
};

let dragContent = (e) => {
    if (!isDragging) {
        if (posX !== SnapSorts[index].x) {
            addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
        }
        return;
    }

    updatePositions(e.x, e.y);
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
};

let dragContentStart = (e) => {
    isDragging = !isDragging;
};

colorPicker.addEventListener('input', (e) => {
    defaultColor = colorPicker.value;
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});

textSize.addEventListener('input', (e) => {
    updateCanvas(textVal, textSize.value, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    textVal = e.target.textData.value;
    canvasFont = e.target.tSize.value;
    defaultColor = e.target.colorPicker.value;
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});

let updateSnapShortList = (i) => {
    let currentCanvas = SnapSorts[i];
    updateCanvas(currentCanvas.textVal, currentCanvas.canvasFont, currentCanvas.color, currentCanvas.x, currentCanvas.y);
};

updateCanvas(textVal, fontSize, defaultColor, posX, posY);

// Undo & Redo functions
undo.addEventListener('click', (e) => {
    e.preventDefault();
    if (index <= 0) return;
    updateSnapShortList(--index);
});
redo.addEventListener('click', (e) => {
    e.preventDefault();
    if (index >= (SnapSorts.length - 1)) return;
    updateSnapShortList(++index);
});


/*added some feature to it*/
// Capitalize and lowercase functions
let capitalizeButton = document.getElementById('capital');
let lowercaseButton = document.getElementById('small');

capitalizeButton.addEventListener('click', (e) => {
    e.preventDefault();
    textVal = textVal.toUpperCase();
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});

lowercaseButton.addEventListener('click', (e) => {
    e.preventDefault();
    textVal = textVal.toLowerCase();
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});

// Clear text function
// Clear text function
let clearButton = document.getElementById('clear');

clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    textVal = ""; 
    // Clear the input field
    document.getElementById('textData').value = ""; 
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts);
});


// PDF Download functionality
let downloadButton = document.getElementById('download');

downloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = mainCanvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('canvas.pdf');
});

// Bold button functionality
let boldButton = document.getElementById('bold');
boldButton.addEventListener('click', (e) => {
    e.preventDefault();
    isBold = !isBold; // Toggle bold
    updateCanvas(textVal, fontSize, defaultColor, posX, posY); // Update the canvas
});

// Italic button functionality
let italicButton = document.getElementById('italic');
italicButton.addEventListener('click', (e) => {
    e.preventDefault();
    isItalic = !isItalic; // Toggle italic
    updateCanvas(textVal, fontSize, defaultColor, posX, posY); // Update the canvas
});
let bgColorPicker = document.getElementById('bgColorPicker');

bgColorPicker.addEventListener('input', function() {
    const bgColor = bgColorPicker.value;
    // Clear the entire canvas and fill it with the new background color
    myCanvas.clearRect(0, 0, cWidth, cHeight);  
    myCanvas.fillStyle = bgColor;
    myCanvas.fillRect(0, 0, cWidth, cHeight);  // Apply new background color
    
    // Redraw the text on top of the new background color
    myCanvas.font = canvasFont; // Ensure the font is set again
    myCanvas.fillStyle = defaultColor; // Set text color
    myCanvas.fillText(textVal, posX, posY); // Draw the text at the last position
});

// Handle background image upload
bgImageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                myCanvas.clearRect(0, 0, mainCanvas.width, mainCanvas.height);  // Clear previous background
                myCanvas.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);  // Draw the image on canvas
            };
        };
        reader.readAsDataURL(file);
    }
});
// Function to draw a rectangle
const drawRectangle = (x, y) => {
    myCanvas.fillStyle = defaultColor; // Use the selected color
    myCanvas.fillRect(x - 50, y - 25, 100, 50); // Adjust size and position as needed
};

// Function to draw a circle
const drawCircle = (x, y) => {
    myCanvas.fillStyle = defaultColor; // Use the selected color
    myCanvas.beginPath();
    myCanvas.arc(x, y, 30, 0, Math.PI * 2); // Adjust radius as needed
    myCanvas.fill();
};

// Function to draw a line
const drawLine = (x1, y1, x2, y2) => {
    myCanvas.strokeStyle = defaultColor; // Use the selected color
    myCanvas.lineWidth = 2; // Adjust line width as needed
    myCanvas.beginPath();
    myCanvas.moveTo(x1, y1);
    myCanvas.lineTo(x2, y2);
    myCanvas.stroke();
};

// Event listeners for shape buttons
document.getElementById('rectangleBtn').addEventListener('click', (e) => {
    e.preventDefault();
    // Draw a rectangle at the current position
    drawRectangle(posX, posY);
    addToSnapSorts('Rectangle', canvasFont, defaultColor, posX, posY);
});

document.getElementById('circleBtn').addEventListener('click', (e) => {
    e.preventDefault();
    // Draw a circle at the current position
    drawCircle(posX, posY);
    addToSnapSorts('Circle', canvasFont, defaultColor, posX, posY);
});

document.getElementById('lineBtn').addEventListener('click', (e) => {
    e.preventDefault();
    // Draw a line from the current position to a new position
    drawLine(posX, posY, posX + 50, posY + 50); // Example coordinates, adjust as needed
    addToSnapSorts('Line', canvasFont, defaultColor, posX, posY);
});
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let gridVisible = false;
const gridSize = 20; // size of grid cells

// Function to draw the grid
function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // light grid color
    ctx.lineWidth = 1;

    for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to toggle grid visibility
function toggleGrid() {
    gridVisible = !gridVisible;
    clearCanvas();
    if (gridVisible) {
        drawGrid();
    }
}

// Event listener for the button
document.getElementById('toggleGrid').addEventListener('click', toggleGrid);

