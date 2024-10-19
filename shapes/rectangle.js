// @ts-check

export default class Rectangle {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {import("../main").Drawing} drawing
   */
  draw({ points, color }) {
    if (points.length < 2) return;

    const [start, end] = points;
    const width = end.x - start.x;
    const height = end.y - start.y;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(start.x, start.y, width, height);
  }

  /**
   * @param {Array<import("../main").Point>} points
   * @param {Array<import("../main").Drawing>} drawings
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @param {string} drawType
   * @returns {void}
   */
  click(points, drawings, x, y, color, drawType) {
    points.push({ x, y });
    if (points.length === 2) {
      drawings.push({ points: [...points], color, type: drawType });
      points.length = 0;
    }
  }

  /**
   * @param {Array<import("../main").Point>} points
   * @param {number} x
   * @param {number} y
   * @param {string} color
   * @returns {void}
   */
  drawPreview(points, x, y, color) {
    const startX = points[0].x;
    const startY = points[0].y;
    const width = x - startX;
    const height = y - startY;

    this.ctx.beginPath();
    this.ctx.rect(startX, startY, width, height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
}
