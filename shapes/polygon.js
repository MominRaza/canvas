export default class Polygon {
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

  /**
   * @param {Array<{x: number, y: number}>} points
   * @param {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>} drawings
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @param {string} drawType
   * @param {number} clickThreshold
   * @returns {void}
   */
  click(points, drawings, x, y, color, drawType, clickThreshold) {
    if (points.length > 0 && Math.abs(x - points[0].x) < clickThreshold && Math.abs(y - points[0].y) < clickThreshold) {
      if (points.length > 2) {
        drawings.push({ points: [...points], color, type: drawType });
        points.length = 0;
      }
    } else {
      points.push({ x, y });
    }
  }

  /**
   * @param {Array<{x: number, y: number}>} points
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @returns {void}
   */
  drawPreview(points, x, y, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    this.ctx.lineTo(x, y);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
}
