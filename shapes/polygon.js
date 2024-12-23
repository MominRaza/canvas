// @ts-check

export default class Polygon {
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
    if (points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.closePath();
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
    if (points.length > 0 && Math.abs(x - points[0].x) < this.clickThreshold && Math.abs(y - points[0].y) < this.clickThreshold) {
      if (points.length > 2) {
        const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
        drawings.push({ points: [...points], color, type: drawingType, canvasSize });
        points.length = 0;
        return true;
      }
    } else {
      points.push({ x, y });
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
    this.ctx.beginPath();
    this.ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    this.ctx.lineTo(x, y);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
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
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @param {import("../main").Point} point
   * @returns {number}
   */
  isPointOnPoint({ points }, { x, y }) {
    return points.findIndex((point) => Math.abs(point.x - x) < this.clickThreshold / 4 && Math.abs(point.y - y) < this.clickThreshold / 4);
  }
}
