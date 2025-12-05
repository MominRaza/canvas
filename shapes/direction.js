// @ts-check

export default class Direction {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} clickThreshold
     */
    constructor(ctx, clickThreshold) {
        this.ctx = ctx;
        this.clickThreshold = clickThreshold;
    }

    static ARROW_LENGTH = 200;

    /**
     * @param {import("../main").Drawing} drawing
     * @throws {Error}
     */
    draw({ points: [start], color, angle }) {
        if (angle === undefined) {
            throw new Error('angle is required for Direction drawings');
        }

        const end = {
            x: start.x + Direction.ARROW_LENGTH * Math.cos(angle),
            y: start.y + Direction.ARROW_LENGTH * Math.sin(angle),
        };

        // Draw the main line
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Draw the arrowhead
        this.#drawArrowhead(start, end, color);
    }

    /**
     * Draws an arrowhead at the end of the line
     * @param {import("../main").Point} start - Starting point of the line
     * @param {import("../main").Point} end - Ending point of the line
     * @param {string} color - Color of the arrow
     */
    #drawArrowhead(start, end, color) {
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 12;
        const arrowAngle = Math.PI / 6; // 30 degrees

        // Calculate arrowhead points
        const arrowPoint1 = {
            x: end.x - arrowLength * Math.cos(angle - arrowAngle),
            y: end.y - arrowLength * Math.sin(angle - arrowAngle),
        };

        const arrowPoint2 = {
            x: end.x - arrowLength * Math.cos(angle + arrowAngle),
            y: end.y - arrowLength * Math.sin(angle + arrowAngle),
        };

        // Draw the arrowhead
        this.ctx.beginPath();
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
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
        if (points.length === 0) {
            // First click: store the starting point
            points.push({ x, y });
            return false;
        } else {
            // Second click: calculate angle and store the drawing
            const start = points[0];
            const angle = Math.atan2(y - start.y, x - start.x);
            const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            drawings.push({
                points: [start],
                color,
                type: drawingType,
                canvasSize,
                angle,
            });
            points.length = 0;
            return true;
        }
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    drawPreview([start], x, y, color) {
        // Calculate angle and end point for preview
        const angle = Math.atan2(y - start.y, x - start.x);
        const end = {
            x: start.x + Direction.ARROW_LENGTH * Math.cos(angle),
            y: start.y + Direction.ARROW_LENGTH * Math.sin(angle),
        };

        // Draw the preview line
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Draw the preview arrowhead
        this.#drawArrowhead(start, end, color);
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {boolean}
     */
    isPointInside({ points: [start], angle }, { x, y }) {
        if (angle === undefined) return false;

        const end = {
            x: start.x + Direction.ARROW_LENGTH * Math.cos(angle),
            y: start.y + Direction.ARROW_LENGTH * Math.sin(angle),
        };

        const { x: x1, y: y1 } = start;
        const { x: x2, y: y2 } = end;

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const totalLength = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) + Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

        return distance >= totalLength - 1;
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
