export default class Polygon {
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

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    const topRight = this.points.reduce((prev, curr) => (curr.x > prev.x ? curr : prev), this.points[0]);
    this.#drawCrossIcon(topRight.x, topRight.y, this.color);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @returns {void}
   */
  #drawCrossIcon(x, y, color) {
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
