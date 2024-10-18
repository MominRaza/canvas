export default class Circle {
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
    const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    const { x, y } = start;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // Same as Rectangle
  // click() { }

  /**
   * @param {Array<{x: number, y: number}>} points
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @returns {void}
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
}
