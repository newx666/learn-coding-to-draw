/**
 * @typedef {import("./types").AppOptions} Options
 */

import { CanvasHelper } from "./canvas-helper.js";

export class App {
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
  }

  /**
   * @returns {this}
   */
  reset() {
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
    //TODO: continue development logic.
    // we have three canvas layers:
    // * grid layer -- just for show grid
    // * pen layer -- for show and hide pen
    // * draw layer -- for show painting lines
    return this;
  }
}
