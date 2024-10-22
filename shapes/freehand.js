// @ts-check

export default class Freehand {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @throws {Error}
   */
  draw({ points, color, lineWidth }) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    if (!lineWidth) throw new Error("lineWidth is required for Freehand drawings");
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();
  }
}
