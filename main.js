// @ts-check

import Polygon from './shapes/polygon.js';
import Rectangle from './shapes/rectangle.js';
import Circle from './shapes/circle.js';
import Triangle from './shapes/triangle.js';
import CrossIcon from './shapes/cross-icon.js';

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Drawing
 * @property {Array<Point>} points
 * @property {string} color
 * @property {string} type
 * @property {number} [radius]
 */

/**
 * @typedef {Object} CanvasSize
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {'polygon'|'rectangle'|'circle'|'triangle'} DrawingType
 */

/**
 * @typedef {'draw'|'move'} DrawingMode
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
 */

export default class DrawCanvasShapes {
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
     * @type {CrossIcon}
     */
    #crossIcon;

    /**
     * @type {number | undefined}
     */
    #movingDrawingIndex;

    /**
     * @type {Point | undefined}
     */
    #movingStartPoint;

    /**
     * @type {Object<string, Polygon|Rectangle|Circle|Triangle>}
     */
    #drawingHandlers;

    /**
     * @param {DrawCanvasShapesOptions} options
     * @throws {Error}
     */
    constructor({
        canvas,
        canvasSize = { width: 497, height: 300 },
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
    }) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas element provided');

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

        this.#init();
    }

    #init() {
        // @ts-ignore
        this.#ctx = this.#canvas.getContext('2d');
        this.#initializeShapes();
        this.#redraw();
        this.#initializeEventListeners();
    }

    #initializeShapes() {
        this.#drawingHandlers = {
            polygon: new Polygon(this.#ctx),
            rectangle: new Rectangle(this.#ctx),
            circle: new Circle(this.#ctx),
            triangle: new Triangle(this.#ctx)
        };
        this.#crossIcon = new CrossIcon(this.#ctx, this.#crossIconSize, this.#showCrossIcon);
    }

    #initializeEventListeners() {
        this.#canvas.onclick = this.#canvasClick;
        this.#canvas.onmouseenter = this.#canvasMouseEnter;
        this.#canvas.onmousedown = this.#canvasMouseDown;
        this.#canvas.onmousemove = this.#canvasMouseMove;
        this.#canvas.onmouseup = this.#canvasMouseUp;
        this.#canvas.onmouseleave = this.#canvasMouseLeave;
    }

    #canvasClick = (event) => {
        if (this.#drawingMode !== 'draw') return;

        const { x, y } = this.#getMousePosition(event);

        if (this.#points.length === 0 && this.#crossIcon.click(this.#drawings, x, y)) {
            return this.#redraw();
        }

        this.#drawingHandlers[this.#drawingType]?.click(this.#points, this.#drawings, x, y, this.#drawingColor, this.#drawingType, this.#clickThreshold);

        this.#redraw();
    }

    #canvasMouseEnter = () => {
        this.#canvas.style.cursor = this.#drawingMode === 'draw' ? 'crosshair' : 'default';
    }

    #canvasMouseDown = (event) => {
        if (this.#drawingMode !== 'move' || this.#drawings.length === 0) return;

        const { x, y } = this.#getMousePosition(event);

        for (let i = this.#drawings.length - 1; i >= 0; i--) {
            const drawing = this.#drawings[i];
            if (this.#isPointInside(drawing, { x, y })) {
                this.#movingDrawingIndex = i;
                this.#movingStartPoint = { x, y };
                this.#canvas.style.cursor = 'grabbing';
                break;
            }
        }
    }

    #canvasMouseMove = (event) => {
        const { x, y } = this.#getMousePosition(event);

        if (this.#drawingMode === 'draw') this.#drawModeMouseMove(x, y);
        else if (this.#drawingMode === 'move') this.#moveModeMouseMove(x, y);
    }

    #drawModeMouseMove(x, y) {
        if (this.#points.length === 0) {
            this.#crossIcon.hover(this.#drawings, x, y);
            return;
        }

        this.#redraw();

        this.#drawingHandlers[this.#drawingType]?.drawPreview(this.#points, x, y, this.#drawingColor);
    }

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

    #canvasMouseUp = () => {
        if (this.#drawingMode !== 'move') return;
        if (this.#movingDrawingIndex === undefined || this.#movingStartPoint === undefined) return;

        this.#movingDrawingIndex = undefined;
        this.#movingStartPoint = undefined;
        this.#canvas.style.cursor = 'grab';
    }

    #canvasMouseLeave = () => {
        if (this.#drawingMode === 'move') {
            this.#movingDrawingIndex = undefined;
            this.#movingStartPoint = undefined;
        }
    }

    #isPointInside(drawing, { x, y }) {
        return this.#drawingHandlers[drawing.type]?.isPointInside(drawing, { x, y });
    }

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
            this.#ctx.strokeStyle = this.#drawingColor;
            this.#ctx.stroke();
        }
    }

    #drawShapes() {
        this.#drawings.forEach((drawing) => {
            this.#drawingHandlers[drawing.type]?.draw(drawing);
            if (this.#drawingMode === 'draw') this.#crossIcon.draw(drawing);
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
     * @param {string} gridColor
     */
    set gridColor(gridColor) {
        this.#gridColor = gridColor;
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
     * @param {number} crossIconSize
     */
    set crossIconSize(crossIconSize) {
        this.#crossIconSize = crossIconSize;
        this.#crossIcon.crossIconSize = crossIconSize;
        this.#redraw();
    }

    /**
     * @param {boolean} showCrossIcon
     */
    set showCrossIcon(showCrossIcon) {
        this.#showCrossIcon = showCrossIcon;
        this.#crossIcon.showCrossIcon = showCrossIcon;
        this.#redraw();
    }

    /**
     * @param {number} clickThreshold
     */
    set clickThreshold(clickThreshold) {
        this.#clickThreshold = clickThreshold;
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
