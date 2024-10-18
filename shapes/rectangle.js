export default class Rectangle {
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

    const [start, end] = points;
    const width = end.x - start.x;
    const height = end.y - start.y;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(start.x, start.y, width, height);
  }
}
