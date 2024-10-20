// @ts-check

export default class Circle {
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {import("../main").Drawing} drawing
   */
  draw({ points, color, radius }) {
    const { x, y } = points[0];
    this.ctx.beginPath();
    // @ts-ignore
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
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
    if (points.length === 0) {
      points.push({ x, y });
    } else {
      const start = points[0];
      const radius = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
      drawings.push({ points: [{ x: start.x, y: start.y }], color, type: drawType, radius });
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
    const start = points[0];
    const radius = Math.sqrt((x - start.x) ** 2 + (y - start.y) ** 2);
    this.ctx.beginPath();
    this.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @param {import("../main").Point} point
   * @returns {boolean}
   */
  isPointInside({ points: [center], radius }, { x, y }) {
    // @ts-ignore
    return Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2) <= radius;
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @param {import("../main").Point} point
   * @param {number} clickThreshold
   * @returns {number}
   */
  isPointOnPoint({ points: [center], radius }, { x, y }, clickThreshold) {
    const distance = Math.sqrt((center.x - x) ** 2 + (center.y - y) ** 2);
    // @ts-ignore
    return distance >= radius - clickThreshold / 8 && distance <= radius + clickThreshold / 8 ? 0 : -1;
  }
}
