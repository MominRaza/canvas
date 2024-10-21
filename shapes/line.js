// @ts-check

export default class Line {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {import("../main").Drawing} drawing
   */
  draw({ points: [start, end], color }) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
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
      drawings.push({ points: [...points], color, type: drawingType });
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
  drawPreview([start], x, y, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
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
  isPointInside({ points: [start, end] }, { x, y }) {
    let { x: x1, y: y1 } = start;
    let { x: x2, y: y2 } = end;

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const totalLength = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) + Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

    return distance >= totalLength - 1;
  }

  // Same as Polygon
  // isPointOnPoint() {}
}
