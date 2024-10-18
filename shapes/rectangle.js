export default class Rectangle {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array<{x: number, y: number}>} points
   * @param {string} color
   */
  constructor(ctx, points, color, crossIconSize) {
    this.ctx = ctx;
    this.points = points;
    this.color = color;
    this.crossIconSize = crossIconSize;
  }

  draw() {
    if (this.points.length < 2) return;

    const [start, end] = this.points;
    const width = end.x - start.x;
    const height = end.y - start.y;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(start.x, start.y, width, height);
  }
}