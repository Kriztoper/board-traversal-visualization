var mousePressed = false;
var lastX, lastY;
var ctx;
var canvas;
var rect;
var hasFillColorToggled = false;
var hasSquareNumbersToggled = false;
var hasVisualizeToggled = false;
var matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];
var unvisited = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];
var unvisitedOddCount = 13;
var unvisitedEvenCount = 12;
var visitedColors = "";
var indexOfVisitedSquares = [];

function initApp() {
    ctx = document.getElementById('demo-canvas').getContext("2d");
    canvas = document.querySelector("#demo-canvas");

    canvas.addEventListener("mousedown", (e) => {
        if (!hasFillColorToggled) {
            mousePressed = true;
            Draw(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top, false);
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (mousePressed) {
            Draw(e.pageX - getOffset(canvas).left, e.pageY - getOffset(canvas).top, true);
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        mousePressed = false;
    });

    canvas.addEventListener("mouseleave", (e) => {
        mousePressed = false;
    });

}

function getOffset(element) {
    if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return ({
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    });   
}

function getElementFromCoordinates(x, y) {
    var canvas = document.getElementById("demo-canvas");
    var board = document.getElementById("board");

    canvas.style.zIndex = 1;
    board.style.zIndex = 2;
    var currentElement = document.elementFromPoint(x, y);
    canvas.style.zIndex = 2;
    board.style.zIndex = 1;

    return currentElement;
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 36;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();

        var element = getElementFromCoordinates(x, y + 110);
        var index = getIndexFromId(element.id);
        if (index != null && hasVisualizeToggled && 
                unvisited[index[0]][index[1]] == 0 && 
                checkIfNotDiagonal(index[0], index[1])) {

            if (index != null) {
                unvisited[index[0]][index[1]] = 1;
                updateVisitedColors(index[0], index[1]);
            }

            countUnvisitedOddSquares();
            countUnvisitedEvenSquares();
            showOddCount();
            showEvenCount();
            showVisitedColors();
        }
    }
    lastX = x; lastY = y;
}

function areIndexEqual(a, b) {
    var len = a.length;
    var i;
    for (i = 0; i < len; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }

    return true;
}

function checkIfNotDiagonal(i, j) {
    if (!indexOfVisitedSquares.length) {
        indexOfVisitedSquares.push([i, j]);
        return true;
    }

    var lastIndex = indexOfVisitedSquares.length - 1;
    var prevIndex = indexOfVisitedSquares[lastIndex];

    // check top
    // [-][]
    if (areIndexEqual([subtractOne(prevIndex[0]), prevIndex[1]], [i, j])) {
        indexOfVisitedSquares.push([i, j]);
        return true;
    }

    // check right
    // [][+]
    if (areIndexEqual([prevIndex[0], addOne(prevIndex[1])], [i, j])) {
        indexOfVisitedSquares.push([i, j]);
        return true;
    }

    // check left
    // []][-]
    if (areIndexEqual([prevIndex[0], subtractOne(prevIndex[1])], [i, j])) {
        indexOfVisitedSquares.push([i, j]);
        return true;
    }

    // check down
    // [+][]
    if (areIndexEqual([addOne(prevIndex[0]), prevIndex[1]], [i, j])) {
        indexOfVisitedSquares.push([i, j]);
        return true;
    }

    return false;
}

function addOne(value) {
    return parseInt(value) + parseInt(1);
}

function subtractOne(value) {
    return parseInt(value) - parseInt(1);
}

function updateIndexOfVisitedSquares(i, j) {
    indexOfVisitedSquares.push([i, j]);
}

function updateVisitedColors(i, j) {
    if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
        visitedColors += "<span style='color: rgb(12, 131, 22)'>G</span>";
    } else if ((i % 2 == 0 && j % 2 != 0) || (i % 2 != 0 && j % 2 == 0)) {
        visitedColors += "<span style='color: #a2a2a2'>W</span>";
    }
}

function countUnvisitedOddSquares() {
    var rowSize = unvisited[0].length;
    var i, j;
    var count = 0;
    for (i = 0; i < unvisited.length; i++) {
        for (j = 0; j < rowSize; j++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
                if (unvisited[i][j] > 0) {
                    count++;
                }
            }
        }
    }
    unvisitedOddCount = 13 - count;
}

function countUnvisitedEvenSquares() {
    var rowSize = unvisited[0].length;
    var i, j;
    var count = 0;
    for (i = 0; i < unvisited.length; i++) {
        for (j = 0; j < rowSize; j++) {
            if ((i % 2 == 0 && j % 2 != 0) || (i % 2 != 0 && j % 2 == 0)) {
                if (unvisited[i][j] > 0) {
                    count++;
                }
            }
        }
    }
    unvisitedEvenCount = 12 - count;
}

function showVisitedColors() {
    document.getElementById("visited-colors").innerHTML = visitedColors;
}

function showOddCount() {
    document.getElementById("odd-counter").innerHTML = unvisitedOddCount;
}

function showEvenCount() {
    document.getElementById("even-counter").innerHTML = unvisitedEvenCount;
}

function clearDrawing() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clearColoredSquares() {
    var rowSize = matrix[0].length;
    var i, j;
    for (i = 0; i < matrix.length; i++) {
        for (j = 0; j < rowSize; j++) {
            matrix[i][j] = 0;
            getDivFromIndex(i, j).style.backgroundColor = "rgb(248, 248, 241)";
        }
    }
}

function resetVisualization() {
    this.unvisited = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
    this.unvisitedOddCount = 13;
    this.unvisitedEvenCount = 12;
    this.visitedColors = "";
    this.indexOfVisitedSquares = [];

    showOddCount();
    showEvenCount();
    showVisitedColors();
}

function changeColor(item) {
    var id = item.id;
    var coordinates = getIndexFromId(id);
    matrix[coordinates[0]][coordinates[1]] = 1;
    item.style.backgroundColor = "rgb(12, 131, 22)"; // green
}

function getIndexFromId(id) {
    return id.match(/\d+/g);
}

function toggleFillColor() {
    if (!hasFillColorToggled) {
        hasFillColorToggled = true;
        var board = document.getElementById('board');
        board.style.zIndex = 2;
        canvas.style.zIndex = 1;
    } else {
        hasFillColorToggled = false;
        var board = document.getElementById('board');
        board.style.zIndex = 1;
        canvas.style.zIndex = 2;
    }
}

function showSquareNumbers() {
    var i, j, num = 1;
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            getDivFromIndex(i, j).innerHTML = "<h1 style='color: #a2a2a2'>" + num++ + "</h1>";
        }
    }
}

function hideSquareNumbers() {
    var i, j;
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            getDivFromIndex(i, j).innerHTML = "<h1></h1>";
        }
    }
}

function toggleSquareNumbers() {
    if (!hasSquareNumbersToggled) {
        hasSquareNumbersToggled = true;
        showSquareNumbers();
    } else {
        hasSquareNumbersToggled = false;
        hideSquareNumbers();
    }
}

function toggleVisualize() {
    if (!hasVisualizeToggled) {
        hasVisualizeToggled = true;
        showVisualizeLabels();
        showVisualizeContents();
    } else {
        hasVisualizeToggled = false;
        hideVisualizeLabels();
        hideVisualizeContents();
    }
}

function showVisualizeLabels() {
    document.getElementById("odd-counter-label").innerHTML = "Odd Count: ";
    document.getElementById("even-counter-label").innerHTML = "Even Count: ";
    document.getElementById("visited-colors-label").innerHTML = "Visited Colors: ";
}

function showVisualizeContents() {
    showOddCount();
    showEvenCount();
    showVisitedColors();
}

function hideVisualizeLabels() {
    document.getElementById("odd-counter-label").innerHTML = "";
    document.getElementById("even-counter-label").innerHTML = "";
    document.getElementById("visited-colors-label").innerHTML = "";
}

function hideVisualizeContents() {
    document.getElementById("odd-counter").innerHTML = "";
    document.getElementById("even-counter").innerHTML = "";
    document.getElementById("visited-colors").innerHTML = "";
}

function getDivIdFromIndex(i, j) {
    return "square" + i + "-" + j;
}

function getDivFromIndex(i, j) {
    return getDivFromId(getDivIdFromIndex(i, j));
}

function getDivFromId(id) {
    return document.getElementById(id);
}

function updateDivColorsFromMatrix() {
    var rowSize = matrix[0].length;
    var i, j;
    for (i = 0; i < matrix.length; i++) {
        for (j = 0; j < rowSize; j++) {
            if (matrix[i][j] == 1) {
                getDivFromIndex(i, j).style.backgroundColor = "rgb(12, 131, 22)";
            } else {
                getDivFromIndex(i, j).style.backgroundColor = "rgb(248, 248, 241)";
            }
        }
    }
}

function rotateCanvasToLeft() {
    var rowSize = matrix[0].length;
    var i, j; 
    for (i = 0; i < Math.floor(rowSize / 2); i++) { 
        for (j = i; j < rowSize - i - 1; j++) { 
            var temp = matrix[i][j];
            matrix[i][j] = matrix[j][rowSize - 1 - i];
            matrix[j][rowSize - 1 - i] = matrix[rowSize - 1 - i][rowSize - 1 - j];
            matrix[rowSize - 1 - i][rowSize - 1 - j] = matrix[rowSize - 1 - j][i];
            matrix[rowSize - 1 - j][i] = temp;
        }
    }
    updateDivColorsFromMatrix();
}

function rotateCanvasToRight() {
    var rowSize = matrix[0].length;
    var i, j; 
    for (i = 0; i < Math.floor(rowSize / 2); i++) { 
        for (j = i; j < rowSize - i - 1; j++) { 
            var temp = matrix[i][j]; 
            matrix[i][j] = matrix[rowSize - 1 - j][i];
            matrix[rowSize - 1 - j][i] = matrix[rowSize - 1 - i][rowSize - 1 - j];
            matrix[rowSize - 1 - i][rowSize - 1 - j] = matrix[j][rowSize - 1 - i];
            matrix[j][rowSize - 1 - i] = temp;
        }
    }
    updateDivColorsFromMatrix();
}

function swapMatrixValues(index1, index2) {
    var valueHolder = matrix[index1[0]][index1[1]];
    matrix[index1[0]][index1[1]] = matrix[index2[0]][index2[1]];
    matrix[index2[0]][index2[1]] = valueHolder;
}

function swapColors(square1, square2) {
    var colorHolder = square1.style.backgroundColor;
    square1.style.backgroundColor = square2.style.backgroundColor;
    square2.style.backgroundColor = colorHolder;
}

function flipTopDown() {
    matrix.reverse();
    updateDivColorsFromMatrix();
}

function flipLeftRight() {
    var rowSize = matrix[0].length;
    var i, j;
    for (i = 0; i < matrix.length; i++) {
        for (j = 0; j < rowSize; j++) {
            matrix[i].reverse();
        }
    }
    updateDivColorsFromMatrix();
}