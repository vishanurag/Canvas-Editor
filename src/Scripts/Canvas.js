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
