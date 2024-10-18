import DrawCanvasShapes from '../main.js';

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSize = document.getElementById('gridSize');
const showGrid = document.getElementById('showGrid');
const height = document.getElementById('height');
const width = document.getElementById('width');

const drawer = new DrawCanvasShapes({
  canvas,
  canvasHeight: height.value,
  canvasWidth: width.value,
  drawingColor: colorPicker.value,
  showGrid: false,
  gridSize: gridSize.value,
});


height.addEventListener('change', (event) => {
  drawer.setCanvasSize(parseInt(width.value), parseInt(event.target.value),);
});

width.addEventListener('change', (event) => {
  drawer.setCanvasSize(parseInt(event.target.value), parseInt(height.value));
});

colorPicker.addEventListener('change', (event) => {
  drawer.setColor(event.target.value);
});

gridSize.addEventListener('change', (event) => {
  drawer.setGridSize(parseInt(event.target.value));
});

showGrid.addEventListener('change', (event) => {
  drawer.toggleGrid(event.target.checked);
});
