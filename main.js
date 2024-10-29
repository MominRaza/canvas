// @ts-check

import Polygon from './shapes/polygon.js';
import Rectangle from './shapes/rectangle.js';
import Circle from './shapes/circle.js';
import Triangle from './shapes/triangle.js';
import Line from './shapes/line.js';
import CrossIcon from './shapes/cross-icon.js';
import Freehand from './shapes/freehand.js';

/**
 * Represents a point in 2D space.
 * @typedef {Object} Point
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */

/**
 * Represents a drawing on the canvas.
 * @typedef {Object} Drawing
 * @property {Array<Point>} points - The points that make up the drawing.
 * @property {string} color - The color of the drawing.
 * @property {DrawingType} type - The type of the drawing.
 * @property {number} [radius] - The radius of the drawing (only for circle).
 * @property {number} [lineWidth] - The line width of the drawing (only for line and freehand).
 * @property {CanvasSize} canvasSize - The size of the canvas when the drawing was created.
 */

/**
 * Represents the size of the canvas.
 * @typedef {Object} CanvasSize
 * @property {number} width - The width of the canvas.
 * @property {number} height - The height of the canvas.
 */

/**
 * The type of drawing.
 * @typedef {'polygon'|'rectangle'|'circle'|'triangle'|'line'|'freehand'} DrawingType
 * @property {'polygon'} polygon - Type for drawing polygons.
 * @property {'rectangle'} rectangle - Type for drawing rectangles.
 * @property {'circle'} circle - Type for drawing circles.
 * @property {'triangle'} triangle - Type for drawing triangles.
 * @property {'line'} line - Type for drawing lines.
 * @property {'freehand'} freehand - Type for drawing freehand shapes.
 */

/**
 * The mode of drawing.
 * @typedef {'draw'|'move'|'resize'|'view'} DrawingMode
 * @property {'draw'} draw - Mode for drawing shapes.
 * @property {'move'} move - Mode for moving shapes.
 * @property {'resize'} resize - Mode for resizing shapes.
 * @property {'view'} view - Mode for viewing shapes without editing.
 */

/**
 * Options for drawing shapes on the canvas.
 * @typedef {Object} DrawCanvasShapesOptions
 * @property {HTMLCanvasElement} canvas - The canvas element to draw shapes on.
 * @property {CanvasSize} [canvasSize] - The size of the canvas.
 * @property {string} [gridColor] - The color of the grid.
 * @property {number} [gridSize] - The size of the grid.
 * @property {boolean} [showGrid] - Wether to show the grid or not.
 * @property {Array<Drawing>} [drawings] - The drawings to display on the canvas.
 * @property {DrawingType} [drawingType] - The type of drawing to draw.
 * @property {string} [drawingColor] - The color of the drawing.
 * @property {DrawingMode} [drawingMode] - The mode of drawing.
 * @property {number} [crossIconSize] - The size of the cross icon.
 * @property {string} [crossIconColor] - The color of the cross icon.
 * @property {string} [crossIconBackgroundColor] - The background color of the cross icon.
 * @property {boolean} [showCrossIcon] - Wether to show the cross icon or not.
 * @property {number} [clickThreshold] - The threshold for detecting final click in polygons.
 * @property {boolean} [resizeOnCanvasSizeChange] - Wether to resize the drawings when the canvas size changes.
 * @property {number} [lineWidth] - The line width of the drawing (only for line and freehand).
 */

export class DrawCanvasShapes {
    /**
     * The canvas element to draw shapes on.
     * @type {HTMLCanvasElement}
     */
    #canvas;

    /**
     * The 2D context of the canvas.
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    /**
     * The points of the current drawing.
     * @type {Array<Point>}
     */
    #points = [];

    /**
     * The drawings to display on the canvas.
     * @type {Array<Drawing>}
     */
    #drawings;

    /**
     * Wether to show the grid or not.
     * @type {boolean}
     */
    #showGrid;

    /**
     * The size of the grid.
     * @type {number}
     */
    #gridSize;

    /**
     * The color of the grid.
     * @type {string}
     */
    #gridColor;

    /**
     * The size of the cross icon.
     * @type {number}
     */
    #crossIconSize;

    /**
     * The color of the cross icon.
     * @type {string}
     */
    #crossIconColor;

    /**
     * The background color of the cross icon.
     * @type {string}
     */
    #crossIconBackgroundColor;

    /**
     * The threshold for detecting final click in polygons.
     * @type {number}
     */
    #clickThreshold;

    /**
     * The type of drawing to draw.
     * @type {DrawingType}
     */
    #drawingType;

    /**
     * The color of the drawing.
     * @type {string}
     */
    #drawingColor;

    /**
     * The mode of drawing.
     * @type {DrawingMode}
     */
    #drawingMode;

    /**
     * Wether to show the cross icon or not.
     * @type {boolean}
     */
    #showCrossIcon;

    /**
     * The cross icon to show on the canvas.
     * @type {CrossIcon | undefined}
     */
    #crossIcon;

    /**
     * The index of the drawing being moved or resized.
     * @type {number | undefined}
     */
    #movingDrawingIndex;

    /**
     * The index of the point being resized.
     * @type {number | undefined}
     */
    #resizingPointIndex;

    /**
     * The point from which the drawing is being moved or resized.
     * @type {Point | undefined}
     */
    #movingStartPoint;

    /**
     * Drawing handlers for all different types of drawings except freehand.
     * @type {Object<string, Polygon|Rectangle|Circle|Triangle|Line> | undefined}
     */
    #drawingHandlers;

    /**
     * Wether a freehand drawing is in progress.
     * @type {boolean | undefined}
     */
    #freehandInProgress = false;

    /**
     * Wether to resize the drawings when the canvas size changes.
     * @type {boolean}
     */
    #resizeOnCanvasSizeChange;

    /**
     * The freehand drawing handler.
     * @type {Freehand | undefined}
     */
    #freehand;

    /**
     * The line width of the drawing (only for line and freehand).
     * @type {number}
     */
    #lineWidth;

    /**
     * Creates a new instance of DrawCanvasShapes.
     * @param {DrawCanvasShapesOptions} options - The options for drawing shapes on the canvas.
     * @throws {Error} - If the canvas element is not provided.
     */
    constructor({
        canvas,
        canvasSize = { width: 1000, height: 500 },
        gridSize = 20,
        gridColor = '#ddd',
        showGrid = false,
        drawings = [],
        drawingType = 'polygon',
        drawingColor = '#000',
        drawingMode = 'draw',
        crossIconSize = 10,
        crossIconColor = '#000',
        crossIconBackgroundColor = '#fff',
        showCrossIcon = true,
        clickThreshold = 20,
        resizeOnCanvasSizeChange = false,
        lineWidth = 2,
    }) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas element provided');

        // @ts-ignore
        this.#canvas = canvas;
        this.#canvas.width = canvasSize.width;
        this.#canvas.height = canvasSize.height;
        this.#gridSize = gridSize;
        this.#gridColor = gridColor;
        this.#showGrid = showGrid;
        this.#drawings = drawings;
        this.#drawingType = drawingType;
        this.#drawingColor = drawingColor;
        this.#drawingMode = drawingMode;
        this.#crossIconSize = crossIconSize;
        this.#crossIconColor = crossIconColor;
        this.#crossIconBackgroundColor = crossIconBackgroundColor;
        this.#showCrossIcon = showCrossIcon;
        this.#clickThreshold = clickThreshold;
        this.#resizeOnCanvasSizeChange = resizeOnCanvasSizeChange;
        this.#lineWidth = lineWidth;

        const context = this.#canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is not supported');
        this.#ctx = context;

        this.#init();
    }

    /**
     * Initializes the canvas
     */
    #init() {
        this.#initializeShapes();
        this.#redraw();
        this.#initializeEventListeners();
    }

    /**
     * Initializes the drawing handlers for all different types of drawings.
     */
    #initializeShapes() {
        this.#drawingHandlers = {
            polygon: new Polygon(this.#ctx, this.#clickThreshold),
            rectangle: new Rectangle(this.#ctx, this.#clickThreshold),
            circle: new Circle(this.#ctx, this.#clickThreshold),
            triangle: new Triangle(this.#ctx, this.#clickThreshold),
            line: new Line(this.#ctx, this.#clickThreshold),
        };
        this.#freehand = new Freehand(this.#ctx);
        this.#crossIcon = new CrossIcon(this.#ctx, this.#crossIconSize, this.#crossIconColor, this.#crossIconBackgroundColor, this.#showCrossIcon);
    }

    /**
     * Initializes the event listeners on the canvas.
     */
    #initializeEventListeners() {
        this.#canvas.onclick = this.#canvasClick;
        this.#canvas.onmouseenter = this.#canvasMouseEnter;
        this.#canvas.onmousedown = this.#canvasMouseDown;
        this.#canvas.onmousemove = this.#canvasMouseMove;
        this.#canvas.onmouseup = this.#resetMoveResizeState;
        this.#canvas.onmouseleave = this.#resetMoveResizeState;
    }

    /**
     * Handles the click event on the canvas.
     * @param {MouseEvent} event - The mouse event.
     */
    #canvasClick = (event) => {
        if (this.#drawingMode !== 'draw') return;
        if (this.#freehandInProgress === undefined) {
            this.#freehandInProgress = false;
            return;
        }

        const { x, y } = this.#getMousePosition(event);

        if (this.#points.length === 0 && this.#crossIcon?.click(this.#drawings, x, y)) {
            return this.#redraw();
        }

        this.#drawingHandlers?.[this.#drawingType]?.click(this.#points, this.#drawings, x, y, this.#drawingColor, this.#drawingType, this.#lineWidth);

        this.#redraw();
    }

    /**
     * Handles the mouse enter event on the canvas.
     */
    #canvasMouseEnter = () => {
        this.#canvas.style.cursor = this.#drawingMode === 'draw' ? 'crosshair' : 'default';
    }

    /**
     * Handles the mouse down event on the canvas.
     * @param {MouseEvent} event - The mouse event.
     */
    #canvasMouseDown = (event) => {
        if (this.#drawingMode === 'draw' && this.#drawingType === 'freehand') {
            this.#freehandInProgress = true;
            this.#points.push(this.#getMousePosition(event));
            return;
        }

        if (this.#drawings.length === 0) return;

        const { x, y } = this.#getMousePosition(event);

        for (let i = this.#drawings.length - 1; i >= 0; i--) {
            const drawing = this.#drawings[i];

            if (this.#drawingMode === 'move') {
                if (this.#isPointInside(drawing, { x, y })) {
                    this.#movingDrawingIndex = i;
                    this.#movingStartPoint = { x, y };
                    this.#canvas.style.cursor = 'grabbing';
                    break;
                }
            } else if (this.#drawingMode === 'resize') {
                const pointIndex = this.#isPointOnPoint(drawing, { x, y });
                if (pointIndex !== -1) {
                    this.#movingDrawingIndex = i;
                    this.#resizingPointIndex = pointIndex;
                    this.#movingStartPoint = { x, y };
                    break;
                }
            }
        }
    }

    /**
     * Handles the mouse move event on the canvas.
     * @param {MouseEvent} event - The mouse event.
     */
    #canvasMouseMove = (event) => {
        const { x, y } = this.#getMousePosition(event);

        if (this.#drawingMode === 'draw') this.#drawModeMouseMove(x, y);
        else if (this.#drawingMode === 'move') this.#moveModeMouseMove(x, y);
        else if (this.#drawingMode === 'resize') this.#resizeModeMouseMove(x, y);
    }

    /**
     * Handles the mouse move event when in draw mode.
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    #drawModeMouseMove(x, y) {
        if (this.#points.length === 0) {
            this.#crossIcon?.hover(this.#drawings, x, y);
            return;
        }

        this.#redraw();

        if (this.#drawingType === 'freehand' && this.#freehandInProgress) {
            this.#points.push({ x, y });
            return;
        }

        this.#drawingHandlers?.[this.#drawingType]?.drawPreview(this.#points, x, y, this.#drawingColor, this.#lineWidth);
    }

    /**
     * Handles the mouse move event when in move mode.
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    #moveModeMouseMove(x, y) {
        if (this.#movingDrawingIndex === undefined || this.#movingStartPoint === undefined) {
            this.#canvas.style.cursor = this.#drawings.some((drawing) => this.#isPointInside(drawing, { x, y })) ? 'grab' : 'default';
        } else {
            const drawing = this.#drawings[this.#movingDrawingIndex];
            const dx = x - this.#movingStartPoint.x;
            const dy = y - this.#movingStartPoint.y;

            drawing.points.forEach((point) => {
                point.x += dx;
                point.y += dy;
            });

            this.#movingStartPoint = { x, y };
            this.#redraw();
        }
    }

    /**
     * Handles the mouse move event when in resize mode.
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    #resizeModeMouseMove(x, y) {
        if (this.#movingDrawingIndex === undefined || this.#resizingPointIndex === undefined || this.#movingStartPoint === undefined) {
            this.#canvas.style.cursor = this.#drawings.some((drawing) => this.#isPointOnPoint(drawing, { x, y }) !== -1) ? 'move' : 'default';
        } else {
            const drawing = this.#drawings[this.#movingDrawingIndex];
            const dx = x - this.#movingStartPoint.x;
            const dy = y - this.#movingStartPoint.y;

            if (drawing.type === 'rectangle' && this.#resizingPointIndex > 1) {
                const [start, end] = drawing.points;
                if (this.#resizingPointIndex === 2) {
                    start.x += dx;
                    end.y += dy;
                } else {
                    end.x += dx;
                    start.y += dy;

                }
            } else if (drawing.type === 'circle') {
                const center = drawing.points[0];
                drawing.radius = Math.sqrt((center.x - x) ** 2 + (center.y - y) ** 2);
            } else {
                const point = drawing.points[this.#resizingPointIndex];
                point.x += dx;
                point.y += dy;
            }

            this.#movingStartPoint = { x, y };
            this.#redraw();
        }
    }

    /**
     * Resets the move and resize state.
     */
    #resetMoveResizeState = () => {
        this.#movingDrawingIndex = undefined;
        this.#resizingPointIndex = undefined;
        this.#movingStartPoint = undefined;

        if (this.#freehandInProgress) {
            if (this.#points.length > 5) {
                const canvasSize = { width: this.#ctx.canvas.width, height: this.#ctx.canvas.height };
                this.#drawings.push({
                    points: this.#points,
                    color: this.#drawingColor,
                    type: this.#drawingType,
                    canvasSize,
                    lineWidth: this.#lineWidth,
                });

                this.#freehandInProgress = undefined;
            }
            this.#points = [];
        }

        this.#redraw();
    }

    /**
     * Checks if a mouse point is inside a drawing
     * @param {Drawing} drawing - The drawing to check.
     * @param {Point} point - The mouse point to check.
     * @returns {boolean} - Wether the mouse point is inside the drawing.
     */
    #isPointInside(drawing, { x, y }) {
        return this.#drawingHandlers?.[drawing.type]?.isPointInside(drawing, { x, y }) ?? false;
    }

    /**
     * Checks if a mouse point is on a point of a drawing
     * @param {Drawing} drawing - The drawing to check.
     * @param {Point} point - The mouse point to check.
     * @returns {number} - The index of the point the mouse point is on if any, otherwise -1.
     */
    #isPointOnPoint(drawing, { x, y }) {
        if (['triangle', 'line'].includes(drawing.type)) {
            return this.#drawingHandlers?.['polygon']?.isPointOnPoint(drawing, { x, y }) ?? -1;
        }
        return this.#drawingHandlers?.[drawing.type]?.isPointOnPoint(drawing, { x, y }) ?? -1;
    }

    /**
     * Gets the mouse position relative to the canvas.
     * @param {MouseEvent} event - The mouse event.
     * @returns {Point} - The mouse position relative to the canvas.
     */
    #getMousePosition(event) {
        const rect = this.#canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    /**
     * Draws the grid on the canvas.
     * @throws {Error} - If the grid size is less than or equal to 0.
     */
    #drawGrid() {
        if (!this.#showGrid) return;
        if (this.#gridSize <= 0) throw new Error('Grid size must be greater than 0');

        this.#ctx.beginPath();
        for (let x = 0; x <= this.#canvas.width; x += this.#gridSize) {
            this.#ctx.moveTo(x, 0);
            this.#ctx.lineTo(x, this.#canvas.height);
        }

        for (let y = 0; y <= this.#canvas.height; y += this.#gridSize) {
            this.#ctx.moveTo(0, y);
            this.#ctx.lineTo(this.#canvas.width, y);
        }

        this.#ctx.strokeStyle = this.#gridColor;
        this.#ctx.lineWidth = 1;
        this.#ctx.stroke();
    }

    /**
     * Redraws the canvas.
     */
    #redraw() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#drawGrid();
        this.#drawShapes();
        if (this.#points.length > 1) {
            this.#ctx.beginPath();
            for (let i = 1; i < this.#points.length; i++) {
                this.#ctx.moveTo(this.#points[i - 1].x, this.#points[i - 1].y);
                this.#ctx.lineTo(this.#points[i].x, this.#points[i].y);
            }
            if (this.#drawingType === 'freehand') {
                this.#ctx.lineWidth = this.#lineWidth;
                this.#ctx.lineCap = "round";
                this.#ctx.lineJoin = "round";
            } else {
                this.#ctx.lineWidth = 2;
            }

            this.#ctx.strokeStyle = this.#drawingColor;
            this.#ctx.stroke();
        }
    }

    /**
     * Draws all the shapes on the canvas.
     */
    #drawShapes() {
        this.#drawings.forEach((drawing) => {
            if (this.#resizeOnCanvasSizeChange) {
                const widthRatio = this.#canvas.width / drawing.canvasSize.width;
                const heightRatio = this.#canvas.height / drawing.canvasSize.height;

                if (!Number.isNaN(widthRatio) && !Number.isNaN(heightRatio) && heightRatio !== 0 && widthRatio !== 0 && (widthRatio !== 1 || heightRatio !== 1)) {
                    drawing.points = drawing.points.map(point => ({
                        x: point.x * widthRatio,
                        y: point.y * heightRatio
                    }));

                    drawing.canvasSize = { width: this.#canvas.width, height: this.#canvas.height };

                    if (drawing.type === 'circle') {
                        const [center, point] = drawing.points;
                        drawing.radius = Math.sqrt((center.x - point.x) ** 2 + (center.y - point.y) ** 2);
                    }
                }
            }

            if (drawing.type === 'freehand') this.#freehand?.draw(drawing);
            else this.#drawingHandlers?.[drawing.type]?.draw(drawing);
            if (this.#drawingMode === 'draw') this.#crossIcon?.draw(drawing);
        });
    }

    // Public setters

    /**
     * Sets the size of the canvas.
     * @param {CanvasSize} canvasSize - The new size of the canvas.
     */
    setCanvasSize({ width, height }) {
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#redraw();
    }

    /**
     * Sets the color of the grid.
     * @param {number} gridSize - The new size of the grid.
     */
    setGridSize(gridSize) {
        this.#gridSize = gridSize;
        this.#redraw();
    }

    /**
     * Sets weather to show the grid or not.
     * @param {boolean} showGrid - Weather to show the grid.
     */
    setShowGrid(showGrid) {
        this.#showGrid = showGrid;
        this.#redraw();
    }

    /**
     * Sets the drawings to display on the canvas
     * @param {Array<Drawing>} drawings - The new drawings to display.
     */
    setDrawings(drawings) {
        this.#drawings = drawings;
        this.#redraw();
    }

    /**
     * Sets the type of drawing to draw.
     * @param {DrawingType} drawingType - The new type of drawing.
     */
    setDrawingType(drawingType) {
        this.#drawingType = drawingType;
    }

    /**
     * Sets the color of the drawing.
     * @param {string} drawingColor - The new color of the drawing.
     */
    setDrawingColor(drawingColor) {
        this.#drawingColor = drawingColor;
    }

    /**
     * Sets the mode of drawing.
     * @param {DrawingMode} drawingMode - The new mode of drawing.
     */
    setDrawingMode(drawingMode) {
        this.#drawingMode = drawingMode;
        this.#redraw();
    }

    /**
     * Sets weather to show the cross icon or not.
     * @param {boolean} showCrossIcon - Weather to show the cross icon.
     */
    setShowCrossIcon(showCrossIcon) {
        this.#showCrossIcon = showCrossIcon;
        if (this.#crossIcon)
            this.#crossIcon.showCrossIcon = showCrossIcon;
        this.#redraw();
    }

    /**
     * Sets the width of the lines in the drawing (only for line and freehand).
     * @param {number} lineWidth - The new width of the lines.
     */
    setLineWidth(lineWidth) {
        this.#lineWidth = lineWidth;
    }

    // Public getters

    /**
     * Gets the current drawings on the canvas.
     * @returns {Array<Drawing>}
     */
    getDrawings() {
        return this.#drawings;
    }

    // Public methods

    /**
     * Cancels the current drawing operation.
     */
    cancelDrawing() {
        this.#points = [];
        this.#redraw();
    }

    /**
     * Clears the canvas and removes all drawings.
     */
    clearCanvas() {
        this.#points = [];
        this.#drawings = [];
        this.#redraw();
    }
}
