// @ts-check

export default class Triangle {
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
    this.ctx.beginPath();
    points.forEach(({ x, y }, index) => {
      index === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
    });
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
   * @returns {void}
   */
  click(points, drawings, x, y, color, drawingType) {
    points.push({ x, y });
    if (points.length === 2) {
      const thirdPoint = {
        x: points[0].x - (points[1].x - points[0].x),
        y: points[1].y
      };
      const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
      drawings.push({ points: [...points, thirdPoint], color, type: drawingType, canvasSize });
      points.length = 0;
    }
  }

  /**
   * @param {Array<import("../main").Point>} points
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @returns {void}
   */
  drawPreview(points, x, y, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(points[0].x - (x - points[0].x), y);
    this.ctx.closePath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @param {import("../main").Point} point
   * @returns {boolean}
   */
  isPointInside({ points: [p1, p2, p3] }, { x, y }) {
    const a = (p1.x - x) * (p2.y - p1.y) - (p2.x - p1.x) * (p1.y - y);
    const b = (p2.x - x) * (p3.y - p2.y) - (p3.x - p2.x) * (p2.y - y);
    const c = (p3.x - x) * (p1.y - p3.y) - (p1.x - p3.x) * (p3.y - y);

    return (a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0)
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
