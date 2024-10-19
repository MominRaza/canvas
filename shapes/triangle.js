// @ts-check

export default class Triangle {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
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
   * @param {string} drawType
   * @returns {void}
   */
  click(points, drawings, x, y, color, drawType) {
    points.push({ x, y });
    if (points.length === 2) {
      const thirdPoint = {
        x: points[0].x - (points[1].x - points[0].x),
        y: points[1].y
      };
      drawings.push({ points: [...points, thirdPoint], color, type: drawType });
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
}
