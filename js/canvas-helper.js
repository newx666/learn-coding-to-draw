"use strict";

/**
 * @typedef {import("./types").CanvasHelperOptions} Options
 * @typedef {import("./types").GridCanvasData} GridCanvasData
 * @typedef {import("./types").Position} Position
 */

const ANGLE_2_PI = Math.PI * 2;
const DEFAULT_GRID_SIZE = 25;
const DEFAULT_UP_PEN_RADIUS = 5;
const DEFAULT_DOWN_PEN_RADIUS = 3;
const DEFAULT_LINE_WIDTH = 3;

export class CanvasHelper {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Partial<Options>|undefined} opt
   */
  constructor(canvas, options = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError("Expect HTMLCanvasElement");
    }
    /**
     * @type {Options}
     * @protected
     */
    this._options = {
      gridSize: DEFAULT_GRID_SIZE,
      upPenRadius: DEFAULT_UP_PEN_RADIUS,
      downPenRadius: DEFAULT_DOWN_PEN_RADIUS,
      lineWidth: DEFAULT_LINE_WIDTH,
      ...options,
    };

    /**
     * @type {HTMLCanvasElement}
     * @protected
     */
    this._canvas = canvas;

    /**
     * @type {CanvasRenderingContext2D}
     * @protected
     */
    this._ctx = canvas.getContext("2d");

    /**
     * @type {Position}
     * @protected
     */
    this._penPosition = { x: 0, y: 0 };

    /**
     * @type {boolean}
     * @protected
     */
    this._isShowPen = false;

    /**
     * @type {boolean}
     * @protected
     */
    this._isPenDown = false;

    /**
     * @type {GridCanvasData}
     * @protected
     * @readonly
     */
    this._gridCanvasData = {
      width: Math.floor(this._canvas.width / this._options.gridSize),
      height: Math.floor(this._canvas.height / this._options.gridSize),
    };
    this._gridCanvasData.center = {
      x: Math.round(this._gridCanvasData.width / 2),
      y: Math.round(this._gridCanvasData.height / 2),
    };
  }

  /**
   * Clear canvas
   * @returns {this}
   */
  clear() {
    this._ctx.moveTo(0, 0);
    this._ctx.clearRect(0, 0, this._width, this._height);
    this._penPosition.x = this._penPosition.y = 0;
    this._isShowPen = false;
    return this;
  }

  /**
   * Draw grid
   * @returns
   */
  drawGrid() {
    const path = new Path2D();
    let i = 0;
    while (i < this._width) {
      path.moveTo(i, 0);
      path.lineTo(i, this._height);
      i += this._options.gridSize;
    }
    i = 0;
    while (i < this._height) {
      path.moveTo(0, i);
      path.lineTo(this._width, i);
      i += this._options.gridSize;
    }
    this._ctx.stroke(path);
    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  penMove(x, y) {
    if (this._isShowPen) {
      this._clearPen();
    }
    this._penPosition.x = x;
    this._penPosition.y = y;
    if (this._isShowPen) {
      this._drawPen();
    }
    return this;
  }

  /**
   * @param {number} dx X offset
   * @param {number} dy Y offset
   * @returns {this}
   */
  penOffset(dx, dy) {
    this.penMove(this._penPosition.x + dx, this._penPosition.y + dy);
    return this;
  }

  /**
   * @returns {this}
   */
  penShow() {
    if (!this._isShowPen) {
      this._isShowPen = true;
      this._drawPen();
    }
    return this;
  }

  /**
   * @returns {this}
   */
  penHide() {
    if (this._isShowPen) {
      this._isShowPen = false;
      this._clearPen();
    }
    return this;
  }

  /**
   * @param {number} dx
   * @param {number} dy
   * @returns {this}
   */
  drawLine(dx, dy) {
    this._ctx.beginPath();
    const backupLineWidth = this._ctx.lineWidth;
    this._ctx.lineWidth = this._options.lineWidth;
    this._ctx.moveTo(...this._currentPenCanvasCoord);
    this._ctx.lineTo(
      ...this._penCoord2Canvas(
        this._penPosition.x + dx,
        this._penPosition.y + dy
      )
    );
    this._ctx.stroke();
    this._ctx.lineWidth = backupLineWidth;
    this.penOffset(dx, dy);
    return this;
  }

  /**
   * @returns {this}
   */
  setPenAtCenter() {
    this.penMove(this._gridCanvasData.center.x, this._gridCanvasData.center.y);
    return this;
  }

  /**
   * @returns {this}
   */
  penDown() {
    this.penHide();
    this._isPenDown = true;
    this.penShow();
    return this;
  }

  /**
   * @returns {this}
   */
  penUp() {
    this.penHide();
    this._isPenDown = false;
    this.penShow();
    return this;
  }

  /**
   * @type {Position}
   * @readonly
   */
   get penPosition() {
    return { ...this._penPosition };
  }

  /**
   * @returns {this}
   * @protected
   */
  _drawPen() {
    this._ctx.beginPath();
    this._ctx.arc(
      this._penPosition.x * this._options.gridSize,
      this._penPosition.y * this._options.gridSize,
      this._currentPenRadius,
      0,
      ANGLE_2_PI
    );
    this._ctx.fill();
  }

  /**
   * @returns {this}
   * @protected
   */
  _clearPen() {
    this._ctx.clearRect(
      this._penPosition.x * this._options.gridSize - this._options.upPenRadius,
      this._penPosition.y * this._options.gridSize - this._options.upPenRadius,
      this._currentPenRadius * 2,
      this._currentPenRadius * 2
    );
    return this;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {[number, number]}
   */
  _penCoord2Canvas(x, y) {
    return [x * this._options.gridSize, y * this._options.gridSize];
  }

  /**
   * @type {number}
   * @readonly
   * @protected
   */
  get _width() {
    return this._canvas.width;
  }

  /**
   * @type {number}
   * @readonly
   * @protected
   */
  get _height() {
    return this._canvas.height;
  }

  /**
   * @type {[number, number]}
   * @readonly
   * @protected
   */
  get _currentPenCanvasCoord() {
    return this._penCoord2Canvas(this._penPosition.x, this._penPosition.y);
  }

  /**
   * @type {number}
   * @readonly
   * @protected
   */
  get _currentPenRadius() {
    return this._isPenDown
      ? this._options.downPenRadius
      : this._options.upPenRadius;
  }
}
