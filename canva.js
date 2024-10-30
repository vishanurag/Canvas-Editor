const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;

let tool = 'pencil';
let drawing = false;
let startX, startY;
let text = '';
let textPosition = null;
let isDraggingText = false;
let selectedText = null;
let size = 5;
let fontSize = 20;
let fontStyle = 'normal';
let textColor = '#000000';
let textItems = []; // Store each text item with properties

// Tool buttons
document.querySelectorAll('.toolbar button').forEach(button => {
    button.addEventListener('click', () => {
        tool = button.id;
        document.querySelector('.text-options').style.display = (tool === 'text') ? 'flex' : 'none';
        ctx.beginPath();
    });
});

// Text options
document.getElementById('font-size').addEventListener('input', (e) => {
    fontSize = parseInt(e.target.value, 10);
});
document.getElementById('font-style').addEventListener('change', (e) => {
    fontStyle = e.target.value;
});
document.getElementById('text-color').addEventListener('input', (e) => {
    textColor = e.target.value;
});

// Size slider
document.getElementById('size-slider').addEventListener('input', (e) => {
    size = parseInt(e.target.value, 10);
});

// Mouse events
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

// Start drawing or placing text
function handleMouseDown(e) {
    startX = e.offsetX;
    startY = e.offsetY;

    if (tool === 'text') {
        const clickedText = findTextAtPosition(startX, startY);
        if (clickedText) {
            selectedText = clickedText;
            isDraggingText = true;
        } else {
            text = prompt("Enter your text:");
            if (text) {
                const textObj = {
                    text,
                    x: startX,
                    y: startY,
                    fontSize,
                    fontStyle,
                    color: textColor
                };
                textItems.push(textObj);
                drawTextItem(textObj);
            }
        }
    } else if (tool === 'line' || tool === 'circle') {
        drawing = true;
    } else {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

// Stop drawing
function handleMouseUp(e) {
    if (drawing && tool === 'line') {
        drawLine(startX, startY, e.offsetX, e.offsetY);
    } else if (drawing && tool === 'circle') {
        const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
        drawCircle(startX, startY, radius);
    }
    drawing = false;
    isDraggingText = false;
    selectedText = null;
    ctx.beginPath();
}

// Dragging and drawing
function handleMouseMove(e) {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    if (tool === 'pencil' || tool === 'marker') {
        ctx.lineWidth = size;
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (tool === 'eraser') {
        ctx.lineWidth = size;
        ctx.strokeStyle = '#f9f9f9';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    if (isDraggingText && selectedText) {
        selectedText.x = x;
        selectedText.y = y;
        redrawCanvas();
    }
}

// Draw Text Function with Style
function drawTextItem({ text, x, y, fontSize, fontStyle, color }) {
    ctx.font = `${fontStyle} ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

// Find if text is clicked
function findTextAtPosition(x, y) {
    return textItems.find(item => Math.abs(item.x - x) < 20 && Math.abs(item.y - y) < 20);
}

// Redraw canvas to show all elements
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textItems.forEach(drawTextItem);
}

// Draw Line Function
function drawLine(x1, y1, x2, y2) {
    ctx.lineWidth = size;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Draw Circle Function
function drawCircle(x, y, radius) {
    ctx.lineWidth = size;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}

// Clear Canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textItems = [];
});
