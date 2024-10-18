export default class Triangle {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {{points: Array<{x: number, y: number}>, color: string, type: string}} drawing
   */
  draw({ points, color }) {
    const [start, end] = points;
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.lineTo(start.x - (end.x - start.x), end.y);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // Same as Rectangle
  // click() {}

  /**
   * @param {Array<{x: number, y: number}>} points
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
