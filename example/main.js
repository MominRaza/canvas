import DrawCanvasShapes from '../main.js';

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSize = document.getElementById('gridSize');
const showGrid = document.getElementById('showGrid');
const height = document.getElementById('height');
const width = document.getElementById('width');
const drawType = document.getElementById('drawType');
const cancelButton = document.getElementById('cancelButton');
const clearButton = document.getElementById('clearButton');
const drawMode = document.getElementById('drawMode');

const drawer = new DrawCanvasShapes({
  canvas,
  canvasHeight: height.value,
  canvasWidth: width.value,
  drawingColor: colorPicker.value,
  showGrid: false,
  gridSize: gridSize.value,
  drawingType: drawType.value,
  drawingMode: drawMode.value,
  drawings: [
    {
      points: [
        { x: 100, y: 100 },
      ],
      radius: 20,
      color: '#000000',
      type: 'circle',
    }
  ],
});

height.addEventListener('change', (event) => {
  drawer.setCanvasSize(parseInt(width.value), parseInt(event.target.value),);
});

width.addEventListener('change', (event) => {
  drawer.setCanvasSize(parseInt(event.target.value), parseInt(height.value));
});

colorPicker.addEventListener('change', (event) => {
  drawer.setDrawingColor(event.target.value);
});

gridSize.addEventListener('change', (event) => {
  drawer.setGridSize(parseInt(event.target.value));
});

showGrid.addEventListener('change', (event) => {
  drawer.setShowGrid(event.target.checked);
});

drawType.addEventListener('change', (event) => {
  drawer.setDrawingType(event.target.value);
});

cancelButton.addEventListener('click', () => {
  drawer.cancelDrawing();
});

clearButton.addEventListener('click', () => {
  drawer.clearCanvas();
});

drawMode.addEventListener('change', (event) => {
  drawer.setDrawingMode(event.target.value);
});
