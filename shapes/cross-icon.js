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
  * @param {{points: Array<{x: number, y: number}>, color: string, type: string}} drawing
  * @returns {void}
  */
  draw(drawing) {
    if (!this.showCrossIcon) return;
    const { points, color, type } = drawing;
    const { x, y } = this.#topRightPoint(points, type);
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

  /**
   * @param {Array<{x: number, y: number}>} points
   * @param {string} type
   * @returns {{x: number, y: number}}
   */
  #topRightPoint(points, type) {
    if (type === 'rectangle') {
      const [start, end] = points;
      return {
        x: Math.max(start.x, end.x),
        y: Math.min(start.y, end.y)
      };
    }

    if (type === 'circle') {
      const start = points[0];
      const end = points[1];
      const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
      const angle = Math.PI / 4;
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

  #calculateDistance(point) {
    const xDistance = this.ctx.canvas.width - point.x;
    const yDistance = point.y;
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
  }

  /**
   * @param {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>} drawings
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  click(drawings, x, y) {
    if (!this.showCrossIcon) return false;

    for (let i = 0; i < drawings.length; i++) {
      const { points, type } = drawings[i];
      const topRight = this.#topRightPoint(points, type);

      if (Math.abs(x - topRight.x) < this.crossIconSize * 1.2 && Math.abs(y - topRight.y) < this.crossIconSize * 1.2) {
        drawings.splice(i, 1);
        this.ctx.canvas.style.cursor = 'crosshair';
        return true;
      }
    }

    return false;
  }

  /**
   * @param {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>} drawings
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  hover(drawings, x, y) {
    if (!this.showCrossIcon) return;

    let cursorStyle = 'crosshair';

    for (let i = 0; i < drawings.length; i++) {
      const { points, type } = drawings[i];
      const topRight = this.#topRightPoint(points, type);
      if (Math.abs(x - topRight.x) < this.crossIconSize * 1.2 && Math.abs(y - topRight.y) < this.crossIconSize * 1.2) {
        cursorStyle = 'pointer';
        break;
      }
    }

    this.ctx.canvas.style.cursor = cursorStyle;
  }
}