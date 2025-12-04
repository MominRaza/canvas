// @ts-check

export default class Circle {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} clickThreshold
     */
    constructor(ctx, clickThreshold) {
        this.ctx = ctx;
        this.clickThreshold = clickThreshold;
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @throws {Error}
     */
    draw({ points, color, radius }) {
        const { x, y } = points[0];
        this.ctx.beginPath();
        if (!radius) {
            throw new Error('Circle radius is required');
        }
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @param {Array<import("../main").Drawing>} drawings
     * @param {number} x
     * @param {number} y
     * @param {string} color
     * @param {import("../main").DrawingType} drawingType
     * @returns {boolean}
     */
    click(points, drawings, x, y, color, drawingType) {
        points.push({ x, y });
        if (points.length === 1) {
            return false;
        }

        const center = points[0];
        const radius = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
        const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
        drawings.push({ points: [...points], color, type: drawingType, radius, canvasSize });
        points.length = 0;
        return true;
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    drawPreview(points, x, y, color) {
        const start = points[0];
        const radius = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
        this.ctx.beginPath();
        this.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {boolean}
     * @throws {Error}
     */
    isPointInside({ points: [center], radius }, { x, y }) {
        if (!radius) {
            throw new Error('Circle radius is required');
        }
        return Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2) <= radius;
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {number}
     * @throws {Error}
     */
    isPointOnPoint({ points: [center], radius }, { x, y }) {
        const distance = Math.sqrt((center.x - x) ** 2 + (center.y - y) ** 2);
        if (!radius) {
            throw new Error('Circle radius is required');
        }
        return distance >= radius - this.clickThreshold / 8 && distance <= radius + this.clickThreshold / 8 ? 0 : -1;
    }
}
