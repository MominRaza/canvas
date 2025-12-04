// @ts-check

export default class Rectangle {
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
     */
    draw({ points, color }) {
        if (points.length < 2) {
            return;
        }

        // Use only 1st and 3rd points for drawing
        const [start, , end] = points;
        const width = end.x - start.x;
        const height = end.y - start.y;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(start.x, start.y, width, height);
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
        if (points.length === 2) {
            const [p1, p3] = points;
            // Create the other two points of the rectangle
            const p2 = { x: p3.x, y: p1.y };
            const p4 = { x: p1.x, y: p3.y };

            const allPoints = [p1, p2, p3, p4];
            const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            drawings.push({ points: [...allPoints], color, type: drawingType, canvasSize });
            points.length = 0;
            return true;
        }
        return false;
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    drawPreview(points, x, y, color) {
        const startX = points[0].x;
        const startY = points[0].y;
        const width = x - startX;
        const height = y - startY;

        this.ctx.beginPath();
        this.ctx.rect(startX, startY, width, height);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {boolean}
     */
    isPointInside({ points: [start, , end] }, { x, y }) {
        let { x: x1, y: y1 } = start;
        let { x: x2, y: y2 } = end;

        if (x1 > x2) {
            [x1, x2] = [x2, x1];
        }
        if (y1 > y2) {
            [y1, y2] = [y2, y1];
        }

        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {number}
     */
    isPointOnPoint({ points }, { x, y }) {
        return points.findIndex(
            point => Math.abs(point.x - x) < this.clickThreshold / 4 && Math.abs(point.y - y) < this.clickThreshold / 4
        );
    }
}
