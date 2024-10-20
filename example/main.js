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
  canvasSize: { width: width.value, height: height.value },
  drawingColor: colorPicker.value,
  showGrid: showGrid.checked,
  gridSize: parseInt(gridSize.value),
  drawingType: drawType.value,
  drawingMode: drawMode.value,
  drawings: [
    {
      points: [
        { x: 50, y: 50 },
      ],
      radius: 40,
      color: '#00000090',
      type: 'circle',
    },
    {
      points: [
        { x: 100, y: 50 },
        { x: 200, y: 150 },
      ],
      color: '#ff000090',
      type: 'rectangle',
    },
    {
      points: [
        { x: 250, y: 100 },
        { x: 300, y: 200 },
        { x: 200, y: 200 },
      ],
      color: '#00ff0090',
      type: 'triangle',
    },
    {
      points: [
        { x: 400, y: 150 },
        { x: 450, y: 175 },
        { x: 450, y: 225 },
        { x: 400, y: 250 },
        { x: 350, y: 225 },
        { x: 350, y: 175 },
      ],
      color: '#0000ff90',
      type: 'polygon',
    }
  ],
});

height.addEventListener('change', (event) => {
  drawer.canvasSize = { width: width.value, height: event.target.value };
});

width.addEventListener('change', (event) => {
  drawer.canvasSize = { width: event.target.value, height: height.value };
});

colorPicker.addEventListener('change', (event) => {
  drawer.drawingColor = event.target.value;
});

gridSize.addEventListener('change', (event) => {
  drawer.gridSize = parseInt(event.target.value);
});

showGrid.addEventListener('change', (event) => {
  drawer.showGrid = event.target.checked;
});

drawType.addEventListener('change', (event) => {
  drawer.drawingType = event.target.value;
});

cancelButton.addEventListener('click', () => {
  drawer.cancelDrawing();
});

clearButton.addEventListener('click', () => {
  drawer.clearCanvas();
});

drawMode.addEventListener('change', (event) => {
  drawer.drawingMode = event.target.value;
});
