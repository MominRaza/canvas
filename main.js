import Polygon from './shapes/polygon.js';
import Rectangle from './shapes/rectangle.js';
import Circle from './shapes/circle.js';
import Triangle from './shapes/triangle.js';
import CrossIcon from './shapes/cross-icon.js';

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
     * @type {Array<{x: number, y: number}>}
     */
    #points;
    /**
     * @type {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>}
    */
    #drawings;
    #isDrawing
    #isGridVisible;
    #gridSize;
    #gridColor;
    #crossIconSize;
    #clickThreshold;
    #drawType;
    #color;
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
     * @param {{canvas: HTMLCanvasElement, canvasHeight: number, canvasWidth: number, drawingColor: string, showGrid: boolean, gridSize: number, drawingType: string, showCrossIcon: boolean}} options
     * @returns {void}
     * @throws {Error}
     */
    constructor({ canvas, canvasHeight, canvasWidth, drawingColor, showGrid, gridSize, drawingType, showCrossIcon }) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas element provided');
        if (drawingType && !['polygon', 'rectangle', 'circle', 'triangle'].includes(drawingType)) {
            throw new Error('Invalid draw type');
        }

        this.#canvas = canvas;
        this.#canvas.height = canvasHeight ?? 400;
        this.#canvas.width = canvasWidth ?? 497;
        this.#drawings = [];
        this.#isDrawing = true;
        this.#isGridVisible = showGrid;
        this.#gridSize = gridSize;
        this.#gridColor = '#ddd';
        this.#crossIconSize = 10;
        this.#clickThreshold = 20;
        this.#drawType = drawingType ?? 'polygon';
        this.#color = drawingColor ?? '#000';
        this.#showCrossIcon = showCrossIcon ?? true;
        this.#init();
    }

    #init() {
        this.#ctx = this.#canvas.getContext('2d');
        this.#canvas.style.cursor = 'crosshair';
        this.#points = [];
        this.#redraw();

        this.#polygon = new Polygon(this.#ctx);
        this.#rectangle = new Rectangle(this.#ctx);
        this.#circle = new Circle(this.#ctx);
        this.#triangle = new Triangle(this.#ctx);
        this.#crossIcon = new CrossIcon(this.#ctx, this.#crossIconSize, this.#showCrossIcon);

        this.#canvas.addEventListener('click', (event) => {
            const rect = this.#canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.#points.length === 0) {
                const removed = this.#crossIcon.click(this.#drawings, x, y);

                if (removed) return this.#redraw();
            }

            switch (this.#drawType) {
                case 'polygon':
                    if (this.#points.length > 0 && Math.abs(x - this.#points[0].x) < this.#clickThreshold && Math.abs(y - this.#points[0].y) < this.#clickThreshold) {
                        if (this.#points.length > 2) {
                            this.#drawings.push({ points: this.#points, color: this.#color, type: this.#drawType });
                            this.#points = [];
                            this.#redraw();
                        }
                    } else {
                        this.#points.push({ x, y });
                        if (this.#points.length > 1) {
                            this.#ctx.beginPath();
                            this.#ctx.moveTo(this.#points[this.#points.length - 2].x, this.#points[this.#points.length - 2].y);
                            this.#ctx.lineTo(x, y);
                            this.#ctx.stroke();
                        }
                    }
                    break;
                case 'rectangle':
                case 'circle':
                case 'triangle':
                    this.#points.push({ x, y });
                    if (this.#points.length === 2) {
                        this.#drawings.push({ points: this.#points, color: this.#color, type: this.#drawType });
                        this.#points = [];
                        this.#redraw();
                    }
                    break;
                default:
                    break;
            }
        });

        this.#canvas.addEventListener('mousemove', (event) => {
            const rect = this.#canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.#points.length === 0) {
                this.#crossIcon.hover(this.#drawings, x, y);
            }

            if (this.#points.length === 0) return;

            this.#redraw();

            switch (this.#drawType) {
                case 'polygon':
                    this.#polygon.drawPreview(this.#points, x, y, this.#color);
                    break;
                case 'rectangle':
                    this.#rectangle.drawPreview(this.#points, x, y, this.#color);
                    break;
                case 'circle':
                    this.#circle.drawPreview(this.#points, x, y, this.#color);
                    break;
                case 'triangle':
                    this.#triangle.drawPreview(this.#points, x, y, this.#color);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * @param {string} width
     * @param {string} height
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
     * @param {boolean} isVisible
     * @returns {void}
     */
    toggleGrid(isVisible) {
        this.#isGridVisible = isVisible;
        this.#redraw();
    }

    /**
     * @param {string} color
     * @returns {void}
     */
    setGridColor(color) {
        this.#gridColor = color;
        this.#redraw();
    }

    /**
     * @param {string} color
     * @returns {void}
     */
    setColor(color) {
        this.#color = color;
    }

    /**
     * @param {'polygon'|'rectangle'|'circle'|'triangle'} type
     * @returns {void}
     * @throws {Error}
     */
    setDrawType(type) {
        if (!['polygon', 'rectangle', 'circle', 'triangle'].includes(type)) {
            throw new Error('Invalid draw type');
        }
        this.#drawType = type;
    }

    /**
     * @returns {void}
     * @throws {Error}
     */
    #drawGrid() {
        if (!this.#isGridVisible) return;
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
            this.#ctx.strokeStyle = this.#color;
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
     * @returns {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>}
     */
    getDrawings() {
        return this.#drawings;
    }
}
