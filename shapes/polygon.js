export default class Polygon {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {{points: Array<{x: number, y: number}>, color: string, type: string}} drawing
   */
  constructor(ctx, drawing) {
    this.ctx = ctx;
    this.drawing = drawing;
  }

  draw() {
    const { points, color } = this.drawing;

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
}
