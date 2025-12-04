import { DrawCanvasShapes } from '../main.js';

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSize = document.getElementById('gridSize');
const showGrid = document.getElementById('showGrid');
const height = document.getElementById('height');
const width = document.getElementById('width');
const drawingType = document.getElementById('drawingType');
const cancelButton = document.getElementById('cancelButton');
const clearButton = document.getElementById('clearButton');
const drawMode = document.getElementById('drawMode');
const lineWidth = document.getElementById('lineWidth');

const drawer = new DrawCanvasShapes({
    canvas,
    canvasSize: { width: width.value, height: height.value },
    drawingColor: colorPicker.value,
    showGrid: showGrid.checked,
    gridSize: parseInt(gridSize.value),
    drawingType: drawingType.value,
    drawingMode: drawMode.value,
    drawings: JSON.parse(localStorage.getItem('drawings')) || [],
    resizeOnCanvasSizeChange: true,
    lineWidth: parseInt(lineWidth.value),
});

height.addEventListener('change', event => {
    drawer.setCanvasSize({ width: width.value, height: event.target.value });
});

width.addEventListener('change', event => {
    drawer.setCanvasSize({ width: event.target.value, height: height.value });
});

colorPicker.addEventListener('change', event => {
    drawer.setDrawingColor(event.target.value);
});

gridSize.addEventListener('change', event => {
    drawer.gridSize = parseInt(event.target.value);
});

showGrid.addEventListener('change', event => {
    drawer.showGrid = event.target.checked;
});

drawingType.addEventListener('change', event => {
    drawer.setDrawingType(event.target.value);
});

cancelButton.addEventListener('click', () => {
    drawer.cancelDrawing();
});

clearButton.addEventListener('click', () => {
    drawer.clearCanvas();
});

drawMode.addEventListener('change', event => {
    drawer.setDrawingMode(event.target.value);
});

document.getElementById('saveButton').addEventListener('click', () => {
    localStorage.setItem('drawings', JSON.stringify(drawer.getDrawings()));
});

lineWidth.addEventListener('change', event => {
    drawer.setLineWidth(parseInt(event.target.value));
});
