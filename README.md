# draw-canvas-shapes

A simple and efficient library for drawing various shapes on an HTML5 canvas. Easily create and manipulate shapes like circles, rectangles, lines, and more with intuitive methods.

## Features

- Draw basic shapes (circles, rectangles, lines, etc.)
- Customize shapes with colors, borders, and styles
- Clear and update the canvas with ease
- Lightweight and easy to integrate

## Installation

Install the package using npm:

```bash
npm install draw-canvas-shapes
```

## Usage

Here's a basic example of how to use the library:

```javascript
import { DrawCanvasShapes } from 'draw-canvas-shapes';

const canvas = document.getElementById('canvas');

// except for canvas, all other properties are optional, you can pass them as per your requirements

const drawer = new DrawCanvasShapes({
  canvas, // required
  canvasSize: { width: 497, height: 300 },
  gridSize: 20,
  gridColor: '#ddd',
  showGrid: false,
  drawings: [],
  drawingType: 'polygon',
  drawingColor: '#000',
  drawingMode: 'draw',
  crossIconSize: 10,
  showCrossIcon: true,
  clickThreshold: 20,
});

// use setter methods to update canvas properties as needed
drawer.canvasSize = { width: 500, height: 300 };
drawer.gridSize = 20;
drawer.gridColor = '#ddd';
drawer.showGrid = true;
drawer.drawings = [];
drawer.drawingType = 'polygon';
drawer.drawingColor = '#000';
drawer.drawingMode = 'draw';
drawer.crossIconSize = 10;
drawer.showCrossIcon = true;
drawer.clickThreshold = 20;

// use cancelDrawing method to cancel the current drawing
drawer.cancelDrawing();

// use clearCanvas method to clear the canvas
drawer.clearCanvas();

// finally, use drawings getter to get the drawings
const drawings = drawer.drawings;
```

## API

### Class: `DrawCanvasShapes`

A class for drawing various shapes on an HTML5 canvas.

#### Constructor

```javascript
new DrawCanvasShapes(options);
```

- __options__: `DrawCanvasShapesOptions` - The options to configure the canvas and drawing properties.
  - __canvas__: `HTMLCanvasElement` - The canvas element to draw on.
  - __canvasSize__: `CanvasSize` (optional) - The size of the canvas.
    - __width__: `number` - The width of the canvas.
    - __height__: `number` - The height of the canvas.
  - __gridColor__: `string` (optional) - The color of the grid lines.
  - __gridSize__: `number` (optional) - The size of the grid cells.
  - __showGrid__: `boolean` (optional) - Whether to show the grid or not.
  - __drawings__: `Array<Drawing>` (optional) - The initial drawings to display on the canvas.
  - __drawingType__: `DrawingType` (optional) - The type of drawing to create (`polygon`, `rectangle`, `circle`, `triangle`).
  - __drawingColor__: `string` (optional) - The color of the drawing.
  - __drawingMode__: `DrawingMode` (optional) - The mode of drawing (`draw`, `move`).
  - __crossIconSize__: `number` (optional) - The size of the cross icon.
  - __showCrossIcon__: `boolean` (optional) - Whether to show the cross icon or not.
  - __clickThreshold__: `number` (optional) - The click threshold for drawing polygons.

#### Properties

- __drawings__: `Array<Drawing>` - Gets the current drawings on the canvas.

#### Methods

- __cancelDrawing()__: `void` - Cancels the current drawing.
- __clearCanvas()__: `void` - Clears the canvas.

### Type: `Drawing`

A type representing a drawing on the canvas.

```javascript
type Drawing = {
  type: DrawingType;
  color: string;
  points: Array<Point>;
  radius?: number;
};
```

- __type__: `DrawingType` - The type of drawing (`polygon`, `rectangle`, `circle`, `triangle`).
- __color__: `string` - The color of the drawing.
- __points__: `Array<Point>` - The points of the drawing.
  - __x__: `number` - The x-coordinate of the point.
  - __y__: `number` - The y-coordinate of the point.
- __radius__: `number` (optional) - The radius of the drawing (for circles).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.

## Bugs and Issues

If you encounter any bugs or issues, please report them on the [GitHub Issues](https://github.com/MominRaza/canvas/issues) page.
