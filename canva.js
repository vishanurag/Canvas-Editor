const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toolButtons = document.querySelectorAll('.toolbar button');
const clearButton = document.getElementById('clear');
const sizeSlider = document.getElementById('size-slider');
const fontSizeInput = document.getElementById('font-size');
const fontStyleSelect = document.getElementById('font-style');
const textColorInput = document.getElementById('text-color');
const textOptionsContainer = document.querySelector('.text-options');

class DrawingApp {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = 1000;
        this.canvas.height = 600;

        // State management
        this.state = {
            tool: 'pencil',
            drawing: false,
            isDraggingText: false,
            selectedText: null,
            startX: 0,
            startY: 0,
            size: 5,
            text: {
                fontSize: 20,
                fontStyle: 'normal',
                color: '#000000',
                items: []
            }
        };

        this.bindEvents();
    }

    // Centralized event binding
    bindEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Tool buttons
        toolButtons.forEach(button => {
            button.addEventListener('click', () => this.changeTool(button.id));
        });

        // Text options
        fontSizeInput.addEventListener('input', (e) => this.state.text.fontSize = parseInt(e.target.value, 10));
        fontStyleSelect.addEventListener('change', (e) => this.state.text.fontStyle = e.target.value);
        textColorInput.addEventListener('input', (e) => this.state.text.color = e.target.value);

        // Size slider
        sizeSlider.addEventListener('input', (e) => this.state.size = parseInt(e.target.value, 10));

        // Clear button
        clearButton.addEventListener('click', () => this.clearCanvas());
    }

    // Change tool and update UI
    changeTool(newTool) {
        this.state.tool = newTool;
        textOptionsContainer.style.display = (newTool === 'text') ? 'flex' : 'none';
        this.ctx.beginPath();
    }

    // Mouse down handler
    handleMouseDown(e) {
        const { offsetX: x, offsetY: y } = e;
        this.state.startX = x;
        this.state.startY = y;

        if (this.state.tool === 'text') {
            const clickedText = this.findTextAtPosition(x, y);
            if (clickedText) {
                this.state.selectedText = clickedText;
                this.state.isDraggingText = true;
            } else {
                const text = prompt("Enter your text:");
                if (text) {
                    this.addTextItem(text, x, y);
                }
            }
        } else if (['line', 'circle'].includes(this.state.tool)) {
            this.state.drawing = true;
        } else {
            this.state.drawing = true;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
        }
    }

    // Mouse move handler
    handleMouseMove(e) {
        if (!this.state.drawing) return;

        const { offsetX: x, offsetY: y } = e;
        const { tool, size, isDraggingText, selectedText } = this.state;

        if (['pencil', 'marker', 'eraser'].includes(tool)) {
            this.ctx.lineWidth = size;
            this.ctx.strokeStyle = tool === 'eraser' ? '#f9f9f9' : 'black';
            this.ctx.lineCap = 'round';
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
        }

        if (isDraggingText && selectedText) {
            selectedText.x = x;
            selectedText.y = y;
            this.redrawCanvas();
        }
    }

    // Mouse up handler
    handleMouseUp(e) {
        const { drawing, tool, startX, startY } = this.state;
        const { offsetX: x, offsetY: y } = e;

        if (drawing && tool === 'line') {
            this.drawLine(startX, startY, x, y);
        } else if (drawing && tool === 'circle') {
            const radius = Math.hypot(x - startX, y - startY);
            this.drawCircle(startX, startY, radius);
        }

        this.state.drawing = false;
        this.state.isDraggingText = false;
        this.state.selectedText = null;
        this.ctx.beginPath();
    }

    // Add text item
    addTextItem(text, x, y) {
        const textObj = {
            text,
            x,
            y,
            fontSize: this.state.text.fontSize,
            fontStyle: this.state.text.fontStyle,
            color: this.state.text.color
        };
        this.state.text.items.push(textObj);
        this.drawTextItem(textObj);
    }

    // Drawing methods
    drawTextItem({ text, x, y, fontSize, fontStyle, color }) {
        this.ctx.font = `${fontStyle} ${fontSize}px Arial`;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.lineWidth = this.state.size;
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawCircle(x, y, radius) {
        this.ctx.lineWidth = this.state.size;
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // Find if text is clicked
    findTextAtPosition(x, y) {
        return this.state.text.items.find(
            item => Math.abs(item.x - x) < 20 && Math.abs(item.y - y) < 20
        );
    }

    // Redraw canvas
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.text.items.forEach(item => this.drawTextItem(item));
    }

    // Clear canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.text.items = [];
    }
}

// Initialize the drawing app
const drawingApp = new DrawingApp(canvas, ctx);