class SnapSortsClass {
    textVal;
    color;
    canvasFont;
    x ;
    y;
    
    constructor(textVal, canvasFont, color, x, y) {
        this.textVal = textVal;
        this.canvasFont = canvasFont;
        this.color = color;
        this.x = x;
        this.y = y;
    }
}


let print = ((val) => {
    console.log(val);
});





let mainCanvas = document.getElementById('mainCanvas');
let textSize = document.getElementById('textSize');
let colorPicker = document.getElementById('colorPicker');
let userForm = document.getElementById('userForm');
let undo = document.getElementById('undoButton');
let redo = document.getElementById('redoButton');
let myCanvas = mainCanvas.getContext("2d");

for (let i = 10; i <= 72; i++) {
    let isSelected = (i == 20)? 'selected': '';
    textSize.innerHTML = textSize.innerHTML + `<option value="${i}" ${isSelected}>${i}</option>`;
}



const fontName = "Verdana, Geneva, Tahoma, sans-serif";
let fontSize = (localStorage.getItem('font-size') != null)? localStorage.getItem('font-size'): "20";
let defaultColor = (localStorage.getItem('font-color') != null)? localStorage.getItem('font-color'): "#00000";
let canvasFont = (localStorage.getItem('font-size') != null)? localStorage.getItem('font-size') + "px " + fontName: fontSize + "px " + fontName;






const cWidth = mainCanvas.width;
const cHeight = mainCanvas.height;
let posX = (localStorage.getItem('pos-x') != null)? localStorage.getItem('pos-x'): cWidth/2 - 50;
let posY = (localStorage.getItem('pos-y') != null)? localStorage.getItem('pos-y'): cHeight/2;

let textVal = "Hello World";
let isDragging = false;

let firstElement = new SnapSortsClass("Hello World", canvasFont, defaultColor, posX, posY);
let SnapSorts = [firstElement];

let index = 0;

let addToSnapSorts = ((textVal, font, defaultColor, x, y) => {
    let SnapElement = new SnapSortsClass(textVal, font, defaultColor, x, y);
    SnapSorts.push(SnapElement);
    index++;
});




let updateCanvas = ((text, tSize,  color, x, y) => {
    fontSize = tSize ;
    defaultColor = color;
    canvasFont = fontSize + "px " + fontName;

    myCanvas.clearRect(0, 0, cWidth, cHeight);
    myCanvas.font = canvasFont;
    myCanvas.fillStyle = defaultColor;
    myCanvas.fillText(text, x, y);


    localStorage.setItem('pos-x', x);
    localStorage.setItem('pos-y', y);
    localStorage.setItem('font-size', fontSize);
    localStorage.setItem('font-color', defaultColor);
});


let updatePositions = ((x, y) => {
    posX = x - 200;
    posY = y - 200;

    if(x >= cWidth ) {
        posX = posX - cWidth;
    }
    if(y >= cWidth ) {
        posY = posY - cHeight;
    }
    if(x < cWidth ) {
        posX = posX + cWidth;
    }
    if(y < cWidth ) {
        posY = posY + cHeight;
    }
});


let dragContent = ((e) => {
    if(!isDragging ) {
        if (posX != SnapSorts[index].x) {
            addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
        }
        return;
    }

    updatePositions(e.x, e.y);
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
});

let dragContentStart = ((e) => {
    isDragging = (!isDragging);
});

colorPicker.addEventListener('input', (e) => {
    defaultColor = colorPicker.value;
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts)
});

textSize.addEventListener('input', (e) => {
    updateCanvas(textVal, textSize.value, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts)
});

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    textVal = e.target.textData.value;
    canvasFont = e.target.tSize.value;
    defaultColor = e.target.colorPicker.value;
    updateCanvas(textVal, fontSize, defaultColor, posX, posY);
    addToSnapSorts(textVal, canvasFont, defaultColor, posX, posY);
    print(SnapSorts)
});


let updateSnapShortList = ((i)=> {
    let currentCanvas = SnapSorts[i];
    updateCanvas(currentCanvas.textVal, currentCanvas.canvasFont, currentCanvas.color, currentCanvas.x, currentCanvas.y);
});



updateCanvas(textVal, fontSize, defaultColor, posX, posY);




// Undo & Redo functions for good user experience..

undo.addEventListener('click', (e) => {
    e.preventDefault();
    if (index <= 0) {
        return;
    }

    updateSnapShortList(--index);
});
redo.addEventListener('click', (e) => {
    e.preventDefault();
    if (index >= (SnapSorts.length-1)) {
        return;
    }
    
    updateSnapShortList(++index);
});
