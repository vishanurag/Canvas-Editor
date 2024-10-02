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

// New array to store multiple text elements
let textElements = [];

// Modify addToSnapSorts to handle multiple elements
let addToSnapSorts = () => {
    let snapshot = textElements.map(el => new SnapSortsClass(el.text, el.font, el.color, el.x, el.y));
    SnapSorts.push(snapshot);
    index++;
};

// New function to add text element
let addTextElement = (text, font, color, x, y) => {
    textElements.push({ text, font, color, x, y });
    renderAllElements();
};

// New function to render all elements
let renderAllElements = () => {
    myCanvas.clearRect(0, 0, cWidth, cHeight);
    textElements.forEach(el => {
        myCanvas.font = el.font;
        myCanvas.fillStyle = el.color;
        myCanvas.fillText(el.text, el.x, el.y);
    });
};

// Modify updateCanvas to use renderAllElements
let updateCanvas = (text, tSize, color, x, y) => {
    fontSize = tSize;
    defaultColor = color;
    canvasFont = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize}px ${fontName}`;

    // Update the current text element or add a new one
    if (textElements.length > 0) {
        textElements[textElements.length - 1] = { text, font: canvasFont, color, x, y };
    } else {
        addTextElement(text, canvasFont, color, x, y);
    }

    renderAllElements();

    localStorage.setItem('pos-x', x);
    localStorage.setItem('pos-y', y);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('font-color', defaultColor);
};

// Modify userForm event listener
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    textVal = e.target.textData.value;
    canvasFont = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize}px ${fontName}`;
    defaultColor = e.target.colorPicker.value;
    addTextElement(textVal, canvasFont, defaultColor, posX, posY);
    addToSnapSorts();
    print(SnapSorts);
});

// New button for adding text
let addTextButton = document.getElementById('addText');
addTextButton.addEventListener('click', (e) => {
    e.preventDefault();
    textVal = document.getElementById('textData').value;
    canvasFont = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize}px ${fontName}`;
    addTextElement(textVal, canvasFont, defaultColor, posX, posY);
    addToSnapSorts();
});

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
    myCanvas.clearRect(0, 0, cWidth, cHeight);  // Clear previous background
    myCanvas.fillStyle = bgColor;
    myCanvas.fillRect(0, 0, cWidth, cHeight);  // Apply new background color
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
