// @ts-check

export default class CrossIcon {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} crossIconSize
   * @param {boolean} showCrossIcon
   */
  constructor(ctx, crossIconSize, showCrossIcon) {
    this.ctx = ctx;
    this.crossIconSize = crossIconSize;
    this.showCrossIcon = showCrossIcon;
  }

  /**
  * @param {import("../main").Drawing} drawing
  */
  draw(drawing) {
    if (!this.showCrossIcon) return;
    const { x, y } = this.#topRightPoint(drawing);
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.crossIconSize, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = drawing.color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x - this.crossIconSize / 2, y - this.crossIconSize / 2);
    this.ctx.lineTo(x + this.crossIconSize / 2, y + this.crossIconSize / 2);
    this.ctx.moveTo(x + this.crossIconSize / 2, y - this.crossIconSize / 2);
    this.ctx.lineTo(x - this.crossIconSize / 2, y + this.crossIconSize / 2);
    this.ctx.stroke();
  }

  /**
   * @param {import("../main").Drawing} drawing
   * @returns {import("../main").Point}
   * @throws {Error}
   */
  #topRightPoint({ points, type, radius }) {
    if (type === 'rectangle') {
      const [start, end] = points;
      return {
        x: Math.max(start.x, end.x),
        y: Math.min(start.y, end.y)
      };
    }

    if (type === 'circle') {
      const start = points[0];
      const angle = Math.PI / 4;
      if (!radius) throw new Error('Circle radius is required');
      return {
        x: start.x + radius * Math.cos(angle),
        y: start.y - radius * Math.sin(angle)
      };
    }

    let topRightPoint = points[0];
    let topRightDistance = this.#calculateDistance(points[0]);

    points.forEach((point) => {
      const distance = this.#calculateDistance(point);
      if (distance < topRightDistance) {
        topRightDistance = distance;
        topRightPoint = point;
      }
    });

    return topRightPoint;
  }

  /**
   * @param {import("../main").Point} point
   * @returns {number}
   */
  #calculateDistance(point) {
    const xDistance = this.ctx.canvas.width - point.x;
    const yDistance = point.y;
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
  }

  /**
   * @param {Array<import("../main").Drawing>} drawings
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  click(drawings, x, y) {
    if (!this.showCrossIcon) return false;

    for (let i = drawings.length - 1; i >= 0; i--) {
      const topRight = this.#topRightPoint(drawings[i]);

      if (Math.abs(x - topRight.x) < this.crossIconSize * 1.2 && Math.abs(y - topRight.y) < this.crossIconSize * 1.2) {
        drawings.splice(i, 1);
        this.ctx.canvas.style.cursor = 'crosshair';
        return true;
      }
    }

    return false;
  }

  /**
   * @param {Array<import("../main").Drawing>} drawings
   * @param {number} x
   * @param {number} y
   */
  hover(drawings, x, y) {
    if (!this.showCrossIcon) return;

    let cursorStyle = 'crosshair';

    for (let i = drawings.length - 1; i >= 0; i--) {
      const topRight = this.#topRightPoint(drawings[i]);

      if (Math.abs(x - topRight.x) < this.crossIconSize * 1.2 && Math.abs(y - topRight.y) < this.crossIconSize * 1.2) {
        cursorStyle = 'pointer';
        break;
      }
    }

    this.ctx.canvas.style.cursor = cursorStyle;
  }
}
