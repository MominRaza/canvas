// @ts-check

export default class Direction {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} clickThreshold
     * @param {number} maxPoints
     */
    constructor(ctx, clickThreshold, maxPoints) {
        this.ctx = ctx;
        this.clickThreshold = clickThreshold;
        this.maxPoints = maxPoints;
    }

    static ARROW_LENGTH = 200;

    /**
     * @param {import("../main").Drawing} drawing
     * @throws {Error}
     */
    draw({ points, color, angle }) {
        if (angle === undefined) {
            throw new Error('angle is required for Direction drawings');
        }

        const polygonPoints = this.#normalizePolygonPoints(points);
        const center = this.#getPolygonCenter(polygonPoints);

        this.ctx.beginPath();
        polygonPoints.forEach(({ x, y }, index) => (index === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y)));
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();

        this.#drawArrow(center, angle, color);
    }

    /**
     * Draws an arrowhead at the end of the line
     * @param {import("../main").Point} start - Starting point of the line
     * @param {number} angle - Angle of the line in radians
     * @param {string} color - Color of the arrow
     */
    #drawArrow(start, angle, color) {
        const direction = { x: Math.cos(angle), y: Math.sin(angle) };
        const end = {
            x: start.x + direction.x * Direction.ARROW_LENGTH,
            y: start.y + direction.y * Direction.ARROW_LENGTH,
        };
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

        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
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
        if (this.#isAwaitingAngle(points)) {
            const polygonPoints = this.#normalizePolygonPoints(points);

            const center = this.#getPolygonCenter(polygonPoints);
            const angle = Math.atan2(y - center.y, x - center.x);
            const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            drawings.push({
                points: polygonPoints,
                color,
                type: drawingType,
                canvasSize,
                angle,
            });
            points.length = 0;
            return true;
        }


        const shouldClose =
            (points.length > 2 &&
                Math.abs(x - points[0].x) < this.clickThreshold &&
                Math.abs(y - points[0].y) < this.clickThreshold) ||
            points.length === this.maxPoints - 1;

        if (shouldClose) {
            const firstPoint = points[0];
            points.push({ x: firstPoint.x, y: firstPoint.y });
            return false;
        }

        points.push({ x, y });
        return false;
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    drawPreview(points, x, y, color) {
        if (!this.#isAwaitingAngle(points)) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
            this.ctx.lineTo(x, y);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
            return;
        }

        const polygonPoints = this.#normalizePolygonPoints(points);
        const center = this.#getPolygonCenter(polygonPoints);
        const angle = Math.atan2(y - center.y, x - center.x);

        this.#drawArrow(center, angle, color);
    }

    /**
     * @param {import("../main").Drawing} drawing
     * @param {import("../main").Point} point
     * @returns {boolean}
     */
    isPointInside({ points }, { x, y }) {
        let isInside = false;
        const n = points.length;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = points[i].x,
                yi = points[i].y;
            const xj = points[j].x,
                yj = points[j].y;

            const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) {
                isInside = !isInside;
            }
        }
        return isInside;
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

    /**
     * @param {Array<import("../main").Point>} points
     * @returns {boolean}
     */
    #isAwaitingAngle(points) {
        if (points.length < 4) {
            return false;
        }

        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];

        return firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y;
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @returns {Array<import("../main").Point>}
     */
    #normalizePolygonPoints(points) {
        if (!this.#isAwaitingAngle(points)) {
            return points;
        }

        return points.slice(0, -1);
    }

    /**
     * @param {Array<import("../main").Point>} points
     * @returns {import("../main").Point}
     */
    #getPolygonCenter(points) {
        let signedArea = 0;
        let centroidX = 0;
        let centroidY = 0;

        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length];
            const cross = current.x * next.y - next.x * current.y;

            signedArea += cross;
            centroidX += (current.x + next.x) * cross;
            centroidY += (current.y + next.y) * cross;
        }

        if (signedArea === 0) {
            const total = points.reduce(
                (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
                { x: 0, y: 0 }
            );

            return {
                x: total.x / points.length,
                y: total.y / points.length,
            };
        }

        return {
            x: centroidX / (3 * signedArea),
            y: centroidY / (3 * signedArea),
        };
    }
}
