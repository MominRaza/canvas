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
    #points;

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
     * @type {string}
     */
    #drawingType;

    /**
     * @type {string}
     */
    #drawingColor;

    /**
     * @type {string}
     */
    #drawingMode;

    /**
     * @type {boolean}
     */
    #showCrossIcon;

    /**
     * @type {Polygon}
     */
    #polygon;

    /**
     * @type {Rectangle}
     */
    #rectangle;

    /**
     * @type {Circle}
     */
    #circle;

    /**
     * @type {Triangle}
     */
    #triangle;

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
     * @param {{canvas: HTMLCanvasElement, canvasHeight: number, canvasWidth: number, drawingColor: string, showGrid: boolean, gridSize: number, gridColor: string, drawingType: string, showCrossIcon: boolean, drawings: Array<Drawing>, crossIconSize: number, clickThreshold: number, drawingMode: string}} options
     * @throws {Error}
     */
    constructor({ canvas, canvasHeight, canvasWidth, drawingColor, showGrid, gridSize, gridColor, drawingType, showCrossIcon, drawings, crossIconSize, clickThreshold, drawingMode }) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas element provided');
        if (drawingType && !['polygon', 'rectangle', 'circle', 'triangle'].includes(drawingType)) {
            throw new Error('Invalid draw type');
        }
        if (drawingMode && !['draw', 'move'].includes(drawingMode)) {
            throw new Error('Invalid draw mode');
        }

        this.#canvas = canvas;
        this.#canvas.height = canvasHeight ?? 300;
        this.#canvas.width = canvasWidth ?? 497;

        this.#gridSize = gridSize ?? 20;
        this.#gridColor = gridColor ?? '#ddd';
        this.#showGrid = showGrid ?? false;

        this.#drawings = drawings ?? [];
        this.#drawingType = drawingType ?? 'polygon';
        this.#drawingColor = drawingColor ?? '#000';
        this.#drawingMode = drawingMode ?? 'draw';

        this.#crossIconSize = crossIconSize ?? 10;
        this.#showCrossIcon = showCrossIcon ?? true;

        this.#clickThreshold = clickThreshold ?? 20;

        this.#init();
    }

    #init() {
        // @ts-ignore
        this.#ctx = this.#canvas.getContext('2d');
        this.#points = [];

        this.#polygon = new Polygon(this.#ctx);
        this.#rectangle = new Rectangle(this.#ctx);
        this.#circle = new Circle(this.#ctx);
        this.#triangle = new Triangle(this.#ctx);
        this.#crossIcon = new CrossIcon(this.#ctx, this.#crossIconSize, this.#showCrossIcon);

        this.#redraw();

        this.#canvas.onclick = this.#canvasClick;

        this.#canvas.onmouseenter = this.#canvasMouseEnter;
        this.#canvas.onmousedown = this.#canvasMouseDown;
        this.#canvas.onmousemove = this.#canvasMouseMove;
        this.#canvas.onmouseup = this.#canvasMouseUp;
        this.#canvas.onmouseleave = this.#canvasMouseLeave;
    }

    #canvasMouseEnter = () => {
        if (this.#drawingMode === 'draw') {
            this.#canvas.style.cursor = 'crosshair';
        } else {
            this.#canvas.style.cursor = 'default';
        }
    }

    #canvasClick = (event) => {
        if (this.#drawingMode !== 'draw') return;

        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.#points.length === 0) {
            const removed = this.#crossIcon.click(this.#drawings, x, y);

            if (removed) return this.#redraw();
        }

        switch (this.#drawingType) {
            case 'polygon':
                this.#polygon.click(this.#points, this.#drawings, x, y, this.#drawingColor, this.#drawingType, this.#clickThreshold);
                break;
            case 'rectangle':
            case 'triangle':
                this.#rectangle.click(this.#points, this.#drawings, x, y, this.#drawingColor, this.#drawingType);
                break;
            case 'circle':
                this.#circle.click(this.#points, this.#drawings, x, y, this.#drawingColor, this.#drawingType);
            default:
                break;
        }

        this.#redraw();
    }

    #canvasMouseDown = (event) => {
        if (this.#drawingMode !== 'move') return;
        if (this.#drawings.length === 0) return;

        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = this.#drawings.length - 1; i >= 0; i--) {
            const drawing = this.#drawings[i];
            if (drawing.type === 'circle') {
                const distance = Math.sqrt((x - drawing.points[0].x) ** 2 + (y - drawing.points[0].y) ** 2);
                // @ts-ignore
                if (distance <= drawing.radius) {
                    this.#movingDrawingIndex = i;
                    this.#movingStartPoint = { x, y };
                    this.#canvas.style.cursor = 'grabbing';
                    break;
                }
            }
        }
    }

    #canvasMouseMove = (event) => {
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.#drawingMode === 'draw') this.#drawModeMouseMove(x, y);
        else if (this.#drawingMode === 'move') this.#moveModeMouseMove(x, y);
    }

    #drawModeMouseMove(x, y) {
        if (this.#points.length === 0) {
            this.#crossIcon.hover(this.#drawings, x, y);
        }

        if (this.#points.length === 0) return;

        this.#redraw();

        switch (this.#drawingType) {
            case 'polygon':
                this.#polygon.drawPreview(this.#points, x, y, this.#drawingColor);
                break;
            case 'rectangle':
                this.#rectangle.drawPreview(this.#points, x, y, this.#drawingColor);
                break;
            case 'circle':
                this.#circle.drawPreview(this.#points, x, y, this.#drawingColor);
                break;
            case 'triangle':
                this.#triangle.drawPreview(this.#points, x, y, this.#drawingColor);
                break;
            default:
                break;
        }
    }

    #moveModeMouseMove(x, y) {
        if (this.#movingDrawingIndex === undefined || this.#movingStartPoint === undefined) {
            let cursorStyle = 'default';

            for (let i = this.#drawings.length - 1; i >= 0; i--) {
                const drawing = this.#drawings[i];
                if (drawing.type === 'circle') {
                    const distance = Math.sqrt((x - drawing.points[0].x) ** 2 + (y - drawing.points[0].y) ** 2);
                    // @ts-ignore
                    if (distance <= drawing.radius) {
                        cursorStyle = 'grab';
                        break;
                    }
                }
            }

            this.#canvas.style.cursor = cursorStyle;
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
        if (this.#drawingMode !== 'move') return;
        if (this.#movingDrawingIndex === undefined || this.#movingStartPoint === undefined) return;

        this.#movingDrawingIndex = undefined;
        this.#movingStartPoint = undefined;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    setCanvasSize(width, height) {
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#redraw();
    }

    /**
     * @param {number} size
     * @returns {void}
     */
    setGridSize(size) {
        this.#gridSize = size;
        this.#redraw();
    }

    /**
     * @param {boolean} show
     * @returns {void}
     */
    setShowGrid(show) {
        this.#showGrid = show;
        this.#redraw();
    }

    /**
     * @param {string} color
     * @returns {void}
     */
    setDrawingColor(color) {
        this.#drawingColor = color;
    }

    /**
     * @param {'polygon'|'rectangle'|'circle'|'triangle'} type
     * @returns {void}
     * @throws {Error}
     */
    setDrawingType(type) {
        if (!['polygon', 'rectangle', 'circle', 'triangle'].includes(type)) {
            throw new Error('Invalid draw type');
        }
        this.#drawingType = type;
    }

    /**
     * @param {string} mode
     * @returns {void}
     * @throws {Error}
     */
    setDrawingMode(mode) {
        if (!['draw', 'move'].includes(mode)) {
            throw new Error('Invalid draw mode');
        }
        this.#drawingMode = mode;
    }

    /**
     * @returns {void}
     * @throws {Error}
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
        this.#ctx.stroke();
    }

    /**
     * @returns {void}
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
            this.#ctx.strokeStyle = this.#drawingColor;
            this.#ctx.stroke();
        }
    }

    #drawShapes() {
        this.#drawings.forEach((drawing) => {
            switch (drawing.type) {
                case 'polygon':
                    this.#polygon.draw(drawing);
                    break;
                case 'rectangle':
                    this.#rectangle.draw(drawing);
                    break;
                case 'circle':
                    this.#circle.draw(drawing);
                    break;
                case 'triangle':
                    this.#triangle.draw(drawing);
                    break;
                default:
                    break;
            }
            this.#crossIcon.draw(drawing);
        });
    }

    /**
     * @returns {void}
    */
    cancelDrawing() {
        this.#points = [];
        this.#redraw();
    }

    /**
     * @returns {void}
     */
    clearCanvas() {
        this.#points = [];
        this.#drawings = [];
        this.#redraw();
    }

    /**
     * @returns {Array<Drawing>}
     */
    getDrawings() {
        return this.#drawings;
    }
}
