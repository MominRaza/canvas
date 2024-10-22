// @ts-check

export default class Line {
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
  draw({ points: [start, end], color, lineWidth }) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    if (!lineWidth) throw new Error("lineWidth is required for Line drawings");
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  /**
   * @param {Array<import("../main").Point>} points
   * @param {Array<import("../main").Drawing>} drawings
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @param {import("../main").DrawingType} drawingType
   * @param {number} lineWidth
   */
  click(points, drawings, x, y, color, drawingType, lineWidth) {
    points.push({ x, y });
    if (points.length === 2) {
      const canvasSize = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
      drawings.push({ points: [...points], color, type: drawingType, canvasSize, lineWidth });
      points.length = 0;
    }
  }

  /**
   * @param {Array<import("../main").Point>} points
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @param {number} lineWidth
   */
  drawPreview([start], x, y, color, lineWidth) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(x, y);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @param {import("../main").Point} point
   * @returns {boolean}
   */
  isPointInside({ points: [start, end] }, { x, y }) {
    let { x: x1, y: y1 } = start;
    let { x: x2, y: y2 } = end;

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
    return points.findIndex((point) => Math.abs(point.x - x) < this.clickThreshold / 4 && Math.abs(point.y - y) < this.clickThreshold / 4);
  }
}
