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
    const { points, color } = drawing;
    const { x, y } = this.#topRightPoint(points);
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
   * @param {number} canvasWidth
   * @returns {{x: number, y: number}}
   */
  #topRightPoint(points) {
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
   * @param {{x: number, y: number}} cursorPosition
   * @returns {boolean}
   */
  click(drawings, { x, y }) {
    if (!this.showCrossIcon) return false;

    for (let i = 0; i < drawings.length; i++) {
      const points = drawings[i].points;
      const topRight = this.#topRightPoint(points);

      if (Math.abs(x - topRight.x) < this.crossIconSize && Math.abs(y - topRight.y) < this.crossIconSize) {
        drawings.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  /**
   * @param {Array<{points: Array<{x: number, y: number}>, color: string, type: string}>} drawings
   * @param {{x: number, y: number}} cursorPosition
   */
  hover(drawings, { x, y }) {
    if (!this.showCrossIcon) return;

    let cursorStyle = 'crosshair';

    for (let i = 0; i < drawings.length; i++) {
      const points = drawings[i].points;
      const topRight = this.#topRightPoint(points, this.ctx.canvas.width);
      if (Math.abs(x - topRight.x) < this.crossIconSize && Math.abs(y - topRight.y) < this.crossIconSize) {
        cursorStyle = 'pointer';
        break;
      }
    }

    this.ctx.canvas.style.cursor = cursorStyle;
  }
}