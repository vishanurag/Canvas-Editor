// Initialize variables
let canvas = document.getElementById('mainCanvas');
let ctx = canvas.getContext('2d');
let textElements = []; // Array to store text elements
let fontSize = 20;
let fontName = 'Arial'; // Default font
let defaultColor = '#000000';
let isBold = false;
let isItalic = false;
let posX = 50;
let posY = 50;

// Function to add text element to the array
function addTextElement(text, font, color, x, y) {
    textElements.push({ text, font, color, x, y });
}

// Function to render all text elements on the canvas
function renderAllElements() {
    // Clear the canvas before re-drawing
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
    // Apply bold and italic styles based on the toggled values
    let canvasFont = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize}px ${fontName}`;

    // Add a new text element or update the existing one
    addTextElement(text, canvasFont, color, x, y);

    // Render all elements including the newly added one
    renderAllElements();

    // Store the canvas data in local storage (optional)
    localStorage.setItem('pos-x', x);
    localStorage.setItem('pos-y', y);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('font-color', defaultColor);
};

// Fix the userForm submit event
let userForm = document.getElementById('userForm');
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Fetch the text input value
    let textVal = e.target.textData.value;

    // Fetch font size and color from the form
    let textSize = parseInt(e.target.tSize.value);
    let color = e.target.colorPicker.value;

    // Update the text on the canvas at the specified position
    updateCanvas(textVal, textSize, color, posX, posY);
});

// Ensure the DOM is fully loaded before populating the textSize options
document.addEventListener('DOMContentLoaded', function () {
    let textSize = document.getElementById('textSize');
    // Populate the dropdown with sizes
    for (let i = 10; i <= 72; i++) {
        let isSelected = (i == 20) ? 'selected' : ''; // Select 20 by default
        let option = `<option value="${i}" ${isSelected}>${i}</option>`;
        textSize.innerHTML += option;
    }
});

// Make the canvas responsive
canvas.width = 400; // Set the canvas width (you can modify this as per your layout)
canvas.height = 300; // Set the canvas height (you can modify this as per your layout)

// Clear button to reset the canvas
let clearButton = document.getElementById('clear');
clearButton.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textElements = []; // Clear all text elements
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

    window.onload = function () {
       
        gsap.from(".btn", {
            duration: 1,  
            y: -50,      
            opacity: 0,   
            stagger: 0.2, 
            ease: "bounce"
        });

       
        

        // Animate the canvas
        gsap.from("#mainCanvas", {
            duration: 2,
            scale: 0.5,    
            opacity: 0,
            ease: "elastic.out(1, 0.3)" 
        });
    };

