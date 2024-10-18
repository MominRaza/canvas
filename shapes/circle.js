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
}
