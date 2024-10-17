/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

canvas.height = 480;
canvas.width = 480;

/**
 * @type {Array<{x: number, y: number}>}
 */
let points = [];

/**
 * @type {Array<{points: Array<{x: number, y: number}>, color: string}>}
 */
let polygons = [];
let isDrawing = false;
let isGridVisible = false;

const CLICK_THRESHOLD = 20;

const drawType = document.getElementById('drawType');
const colorPicker = document.getElementById('colorPicker');
const drawButton = document.getElementById('drawButton');
const cancelButton = document.getElementById('cancelButton');
const clearButton = document.getElementById('clearButton');
const gridSizeSelect = document.getElementById('gridSize');
const showGridButton = document.getElementById('showGridButton');

drawButton.addEventListener('click', () => {
    isDrawing = true;
    drawButton.disabled = true;
    cancelButton.disabled = false;
    points = [];
    canvas.style.cursor = 'crosshair';
});

cancelButton.addEventListener('click', () => {
    isDrawing = false;
    drawButton.disabled = false;
    cancelButton.disabled = true;
    points = [];
    canvas.style.cursor = 'default';
    redraw();
});

clearButton.addEventListener('click', () => {
    polygons = [];
    redraw();
});

showGridButton.addEventListener('click', () => {
    isGridVisible = !isGridVisible;
    if (isGridVisible) {
        const gridSize = parseInt(gridSizeSelect.value);
        drawGrid(gridSize);
        showGridButton.textContent = 'Hide Grid';
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showGridButton.textContent = 'Show Grid';
    }
    redraw();
});

function drawGrid(gridSize) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.strokeStyle = '#ddd';
    ctx.stroke();
}

/**
 * @param {{points: Array<{x: number, y: number}>, color: string}} polygon
 * @returns {void}
 */
function drawPolygon(polygon) {
    const points = polygon.points;
    const color = polygon.color;

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    const topRight = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), points[0]);
    drawCrossIcon(topRight.x, topRight.y, color);
}

function drawCrossIcon(x, y, color) {
    const size = CLICK_THRESHOLD;
    const radius = size / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - radius / 2, y - radius / 2);
    ctx.lineTo(x + radius / 2, y + radius / 2);
    ctx.moveTo(x + radius / 2, y - radius / 2);
    ctx.lineTo(x - radius / 2, y + radius / 2);
    ctx.stroke();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawing) {
        if (points.length > 0 && Math.abs(x - points[0].x) < CLICK_THRESHOLD && Math.abs(y - points[0].y) < CLICK_THRESHOLD) {
            polygons.push({ points, color: colorPicker.value });
            isDrawing = false;
            points = [];
            redraw();
            drawButton.disabled = false;
            cancelButton.disabled = true;
            canvas.style.cursor = 'default';
        } else {
            points.push({ x, y });
            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    } else {
        for (let i = 0; i < polygons.length; i++) {
            const points = polygons[i].points;
            const topRight = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), polygons[i].points[0]);
            if (Math.abs(x - topRight.x) < CLICK_THRESHOLD / 2 && Math.abs(y - topRight.y) < CLICK_THRESHOLD / 2) {
                polygons.splice(i, 1);
                redraw();
                return;
            }
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDrawing) {
        if (points.length === 0) return;

        redraw();

        ctx.beginPath();
        ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorPicker.value;
        ctx.stroke();
    } else {
        let cursorStyle = 'default';

        for (let i = 0; i < polygons.length; i++) {
            const points = polygons[i].points;
            const topRight = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), polygons[i].points[0]);
            if (Math.abs(x - topRight.x) < CLICK_THRESHOLD / 2 && Math.abs(y - topRight.y) < CLICK_THRESHOLD / 2) {
                cursorStyle = 'pointer';
                break;
            }
        }

        canvas.style.cursor = cursorStyle;
    }
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isGridVisible) {
        const gridSize = parseInt(gridSizeSelect.value);
        drawGrid(gridSize);
    }

    polygons.forEach(drawPolygon);

    if (points.length > 1) {
        ctx.beginPath();
        for (let i = 1; i < points.length; i++) {
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = colorPicker.value;
        ctx.stroke();
    }
}
