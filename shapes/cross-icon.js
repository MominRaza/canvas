export default class CrossIcon {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {{points: Array<{x: number, y: number}>, color: string, type: string}} drawing
   * @param {number} crossIconSize
   */
  constructor(ctx, drawing, crossIconSize) {
    this.ctx = ctx;
    this.drawing = drawing;
    this.crossIconSize = crossIconSize;
  }

  draw() {
    const { points, color } = this.drawing;
    const { x, y } = points[0];
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.crossIconSize, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = color;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x - this.crossIconSize / 2, y - this.crossIconSize / 2);
    this.ctx.lineTo(x + this.crossIconSize / 2, y + this.crossIconSize / 2);
    this.ctx.moveTo(x + this.crossIconSize / 2, y - this.crossIconSize / 2);
    this.ctx.lineTo(x - this.crossIconSize / 2, y + this.crossIconSize / 2);
    this.ctx.stroke();
  }
}