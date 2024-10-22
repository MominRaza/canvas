// @ts-check

import Polygon from './shapes/polygon.js';
import Rectangle from './shapes/rectangle.js';
import Circle from './shapes/circle.js';
import Triangle from './shapes/triangle.js';
import Line from './shapes/line.js';
import CrossIcon from './shapes/cross-icon.js';
import Freehand from './shapes/freehand.js';

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Drawing
 * @property {Array<Point>} points
 * @property {string} color
 * @property {DrawingType} type
 * @property {number} [radius]
 * @property {number} [lineWidth]
 * @property {CanvasSize} canvasSize
 */

/**
 * @typedef {Object} CanvasSize
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {'polygon'|'rectangle'|'circle'|'triangle'|'line'|'freehand'} DrawingType
 */

/**
 * @typedef {'draw'|'move'|'resize'} DrawingMode
 */

/**
 * @typedef {Object} DrawCanvasShapesOptions
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasSize} [canvasSize]
 * @property {string} [gridColor]
 * @property {number} [gridSize]
 * @property {boolean} [showGrid]
 * @property {Array<Drawing>} [drawings]
 * @property {DrawingType} [drawingType]
 * @property {string} [drawingColor]
 * @property {DrawingMode} [drawingMode]
 * @property {number} [crossIconSize]
 * @property {boolean} [showCrossIcon]
 * @property {number} [clickThreshold]
 * @property {boolean} [resizeOnCanvasSizeChange]
 * @property {number} [lineWidth]
 */

export class DrawCanvasShapes {
    /**
     * @type {HTMLCanvasElement}
     */
    #canvas;

    /**
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    /**
     * @type {Array<Point>}
     */
    #points = [];

    /**
     * @type {Array<Drawing>}
     */
    #drawings;

    /**
     * @type {boolean}
     */
    #showGrid;

    /**
     * @type {number}
     */
    #gridSize;

    /**
     * @type {string}
     */
    #gridColor;

    /**
     * @type {number}
     */
    #crossIconSize;

    /**
     * @type {number}
     */
    #clickThreshold;

    /**
     * @type {DrawingType}
     */
    #drawingType;

    /**
     * @type {string}
     */
    #drawingColor;

    /**
     * @type {DrawingMode}
     */
    #drawingMode;

    /**
     * @type {boolean}
     */
    #showCrossIcon;

    /**
     * @type {CrossIcon | undefined}
     */
    #crossIcon;

    /**
     * @type {number | undefined}
     */
    #movingDrawingIndex;

    /**
     * @type {number | undefined}
     */
    #resizingPointIndex;

    /**
     * @type {Point | undefined}
     */
    #movingStartPoint;

    /**
     * @type {Object<string, Polygon|Rectangle|Circle|Triangle|Line> | undefined}
     */
    #drawingHandlers;

    /**
     * @type {boolean | undefined}
     */
    #freehandInProgress = false;

    /**
     * @type {boolean}
     */
    #resizeOnCanvasSizeChange;

    /**
     * @type {Freehand | undefined}
     */
    #freehand;

    /**
     * @type {number}
     */
    #lineWidth;

    /**
     * @param {DrawCanvasShapesOptions} options
     * @throws {Error}
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
        this.#showCrossIcon = showCrossIcon;
        this.#clickThreshold = clickThreshold;
        this.#resizeOnCanvasSizeChange = resizeOnCanvasSizeChange;
        this.#lineWidth = lineWidth;

        const context = this.#canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is not supported');
        this.#ctx = context;

        this.#init();
    }

    #init() {
        this.#initializeShapes();
        this.#redraw();
        this.#initializeEventListeners();
    }

    #initializeShapes() {
        this.#drawingHandlers = {
            polygon: new Polygon(this.#ctx, this.#clickThreshold),
            rectangle: new Rectangle(this.#ctx, this.#clickThreshold),
            circle: new Circle(this.#ctx, this.#clickThreshold),
            triangle: new Triangle(this.#ctx, this.#clickThreshold),
            line: new Line(this.#ctx, this.#clickThreshold),
        };
        this.#freehand = new Freehand(this.#ctx);
        this.#crossIcon = new CrossIcon(this.#ctx, this.#crossIconSize, this.#showCrossIcon);
    }

    #initializeEventListeners() {
        this.#canvas.onclick = this.#canvasClick;
        this.#canvas.onmouseenter = this.#canvasMouseEnter;
        this.#canvas.onmousedown = this.#canvasMouseDown;
        this.#canvas.onmousemove = this.#canvasMouseMove;
        this.#canvas.onmouseup = this.#resetMoveResizeState;
        this.#canvas.onmouseleave = this.#resetMoveResizeState;
    }

    /**
     * @param {MouseEvent} event
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

    #canvasMouseEnter = () => {
        this.#canvas.style.cursor = this.#drawingMode === 'draw' ? 'crosshair' : 'default';
    }

    /**
     * @param {MouseEvent} event
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
     * @param {MouseEvent} event
     */
    #canvasMouseMove = (event) => {
        const { x, y } = this.#getMousePosition(event);

        if (this.#drawingMode === 'draw') this.#drawModeMouseMove(x, y);
        else if (this.#drawingMode === 'move') this.#moveModeMouseMove(x, y);
        else if (this.#drawingMode === 'resize') this.#resizeModeMouseMove(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
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
     * @param {number} x
     * @param {number} y
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
     * @param {number} x
     * @param {number} y
     */
    #resizeModeMouseMove(x, y) {
        if (this.#movingDrawingIndex === undefined || this.#resizingPointIndex === undefined || this.#movingStartPoint === undefined) {
            this.#canvas.style.cursor = this.drawings.some((drawing) => this.#isPointOnPoint(drawing, { x, y }) !== -1) ? 'move' : 'default';
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
     * @param {Drawing} drawing
     * @param {Point} point
     * @returns {boolean}
     */
    #isPointInside(drawing, { x, y }) {
        return this.#drawingHandlers?.[drawing.type]?.isPointInside(drawing, { x, y }) ?? false;
    }

    /**
     * @param {Drawing} drawing
     * @param {Point} point
     * @returns {number}
     */
    #isPointOnPoint(drawing, { x, y }) {
        if (['triangle', 'line'].includes(drawing.type)) {
            return this.#drawingHandlers?.['polygon']?.isPointOnPoint(drawing, { x, y }) ?? -1;
        }
        return this.#drawingHandlers?.[drawing.type]?.isPointOnPoint(drawing, { x, y }) ?? -1;
    }

    /**
     * @param {MouseEvent} event
     * @returns {Point}
     */
    #getMousePosition(event) {
        const rect = this.#canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

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

    #drawShapes() {
        this.#drawings.forEach((drawing) => {
            if (this.#resizeOnCanvasSizeChange) {
                const widthRatio = this.#canvas.width / drawing.canvasSize.width;
                const heightRatio = this.#canvas.height / drawing.canvasSize.height;

                this.#ctx.save();
                this.#ctx.scale(widthRatio, heightRatio);
            }

            if (drawing.type === 'freehand') this.#freehand?.draw(drawing);
            else this.#drawingHandlers?.[drawing.type]?.draw(drawing);
            if (this.#drawingMode === 'draw') this.#crossIcon?.draw(drawing);

            if (this.#resizeOnCanvasSizeChange) this.#ctx.restore();
        });
    }

    // Public setters

    /**
     * @param {CanvasSize} canvasSize
     */
    set canvasSize({ width, height }) {
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#redraw();
    }

    /**
     * @param {number} gridSize
     */
    set gridSize(gridSize) {
        this.#gridSize = gridSize;
        this.#redraw();
    }

    /**
     * @param {boolean} showGrid
     */
    set showGrid(showGrid) {
        this.#showGrid = showGrid;
        this.#redraw();
    }

    /**
     * @param {Array<Drawing>} drawings
     */
    set drawings(drawings) {
        this.#drawings = drawings;
        this.#redraw();
    }

    /**
     * @param {DrawingType} drawingType
     */
    set drawingType(drawingType) {
        this.#drawingType = drawingType;
    }

    /**
     * @param {string} drawingColor
     */
    set drawingColor(drawingColor) {
        this.#drawingColor = drawingColor;
    }

    /**
     * @param {DrawingMode} drawingMode
     */
    set drawingMode(drawingMode) {
        this.#drawingMode = drawingMode;
        this.#redraw();
    }

    /**
     * @param {boolean} showCrossIcon
     */
    set showCrossIcon(showCrossIcon) {
        this.#showCrossIcon = showCrossIcon;
        if (this.#crossIcon)
            this.#crossIcon.showCrossIcon = showCrossIcon;
        this.#redraw();
    }

    /**
     * @param {number} lineWidth
     */
    set lineWidth(lineWidth) {
        this.#lineWidth = lineWidth;
    }

    // Public getters

    /**
     * @returns {Array<Drawing>}
     */
    get drawings() {
        return this.#drawings;
    }

    // Public methods

    cancelDrawing() {
        this.#points = [];
        this.#redraw();
    }

    clearCanvas() {
        this.#points = [];
        this.#drawings = [];
        this.#redraw();
    }
}
