/**
 * @typedef {import("./types").AppOptions} Options
 * @typedef {import("./types").Position} Position
 * @typedef {import("./types").Size} Size
 */

import { CanvasHelper } from "./canvas-helper.js";

export class DrawUnit {
  /**
   * @param {Options} options
   */
  constructor(options) {
    if (!options) {
      throw new TypeError("Error");
    }

    /**
     * @type {Options}
     * @protected
     */
    this._options = options;

    /**
     * @type {CanvasHelper}
     * @protected
     */
    this._grid = this._appendLayer("grid");

    /**
     * @type {CanvasHelper}
     * @protected
     */
    this._pen = this._appendLayer("pen");

    /**
     * @type {CanvasHelper}
     * @protected
     */
    this._draw = this._appendLayer("draw");

    /**
     * @type {boolean}
     * @protected
     */
    this._isPenDown = false;
  }

  /**
   * @returns {this}
   */
  reset() {
    this.penUp();

    // clear all canvases
    this._grid.clear();
    this._pen.clear();
    this._draw.clear();

    // draw grid
    this._grid.drawGrid();

    // set pen at center
    this._pen.setPenAtCenter().penShow();
    this._draw.setPenAtCenter();

    return this;
  }

  /**
   * Down pen
   * @returns {this}
   */
  penDown() {
    this._pen.penDown();
    this._isPenDown = true;
    return this;
  }

  /**
   * Up pen
   * @returns {this}
   */
  penUp() {
    this._pen.penUp();
    this._isPenDown = false;
    return this;
  }

  /**
   * Offset pen and draw if pen is down
   * @param {number} dx X move offset
   * @param {number} dy Y move offset
   */
  moveOffset(dx, dy) {
    this._pen.penOffset(dx, dy);
    if (this._isPenDown) {
      this._draw.drawLine(dx, dy);
    } else {
      this._draw.penOffset(dx, dy);
    }
  }

  /**
   * @type {Position}
   * @readonly
   */
  get penPosition() {
    return this._pen.penPosition;
  }

  /**
   * @type {Size}
   * @readonly
   */
  get fieldSize() {
    return this._grid.gridFieldSize;
  }

  /**
   * @type {boolean}
   * @readonly
   */
  get isPenDown() {
    return this._isPenDown;
  }

  /**
   * @param {string} className
   * @returns {CanvasHelper}
   * @protected
   */
  _appendLayer(className) {
    const canvas = document.createElement("canvas");
    canvas.width = this._options.width;
    canvas.height = this._options.height;
    canvas.className = className;
    this._options.root.appendChild(canvas);
    return new CanvasHelper(canvas, this._options.canvasOptions);
  }

  _init() {
    this._grid.drawGrid();
    return this;
  }
}
