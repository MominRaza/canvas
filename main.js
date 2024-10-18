import Polygon from './shapes/polygon.js';

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

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {number} canvasHeight
     * @param {number} canvasWidth
     * @param {string} drawingColor
     * @param {boolean} showGrid
     * @param {number} gridSize
     * @returns {void}
     * @throws {Error}
     */
    constructor({ canvas, canvasHeight, canvasWidth, drawingColor, showGrid, gridSize }) {
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas element provided');
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
        this.#drawType = 'polygon';
        this.#color = drawingColor ?? '#000';
        this.#init();
    }

    #init() {
        this.#ctx = this.#canvas.getContext('2d');
        this.#canvas.style.cursor = 'crosshair';
        this.#points = [];
        this.#redraw();

        this.#canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.#points.length === 0) {
                for (let i = 0; i < this.#drawings.length; i++) {
                    const points = this.#drawings[i].points;
                    const topRight = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), this.#drawings[i].points[0]);
                    if (Math.abs(x - topRight.x) < this.#clickThreshold && Math.abs(y - topRight.y) < this.#clickThreshold) {
                        this.#drawings.splice(i, 1);
                        this.#redraw();
                        return;
                    }
                }
            }

            if (this.#points.length > 0 && Math.abs(x - this.#points[0].x) < this.#clickThreshold && Math.abs(y - this.#points[0].y) < this.#clickThreshold) {
                if (this.#points.length > 2) {
                    this.#drawings.push({ points: this.#points, color: this.#color });
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
        });

        this.#canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.#points.length === 0) {
                let cursorStyle = 'crosshair';

                for (let i = 0; i < this.#drawings.length; i++) {
                    const points = this.#drawings[i].points;
                    const topRight = points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), this.#drawings[i].points[0]);
                    if (Math.abs(x - topRight.x) < this.#clickThreshold && Math.abs(y - topRight.y) < this.#clickThreshold) {
                        cursorStyle = 'pointer';
                        break;
                    }
                }

                this.#canvas.style.cursor = cursorStyle;
            }

            if (this.#points.length === 0) return;

            this.#redraw();

            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#points[this.#points.length - 1].x, this.#points[this.#points.length - 1].y);
            this.#ctx.lineTo(x, y);
            this.#ctx.lineWidth = 2;
            this.#ctx.strokeStyle = this.#color;
            this.#ctx.stroke();
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
     * @param {'polygon'|'rectangle'} type
     * @returns {void}
     * @throws {Error}
     */
    setDrawType(type) {
        if (type !== 'polygon') {
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
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.#drawGrid();

        this.#drawings.forEach((drawing) => {
            const polygonShape = new Polygon(this.#ctx, drawing.points, drawing.color, this.#crossIconSize);
            polygonShape.draw();
        });

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
}
