/**
 * @typedef {import("./command-executor").CommandExecutor} CommandExecutor
 * @typedef {import("./draw-unit").DrawUnit} DrawUnit
 */
export class KeyBinder {
  /**
   * @param {CommandExecutor} executor
   * @param {DrawUnit} drawUnit
   */
  constructor(executor, drawUnit) {
    /**
     * @private
     * @type {CommandExecutor}
     */
    this._executor = executor;

    /**
     * @private
     * @type {DrawUnit}
     */
    this._drawUnit = drawUnit;

    /**
     * @private
     * @type {boolean}
     */
    this._enabled = false;

    /**
     * @private
     * @type {Function}
     */
    this._handler = this._onKeyUp.bind(this);
  }

  enable() {
    if (this._enabled) {
      return;
    }
    this._enabled = true;
    window.addEventListener("keyup", this._handler);
  }

  disable() {
    if (!this._enabled) {
      return;
    }
    this._enabled = false;
    window.removeEventListener("keyup", this._handler);
  }

  /**
   * @private
   * @param {KeyboardEvent} event
   */
  _onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this._executor.execute("up");
        break;
      case "KeyS":
      case "ArrowDown":
        this._executor.execute("down");
        break;
      case "KeyA":
      case "ArrowLeft":
        this._executor.execute("left");
        break;
      case "KeyD":
      case "ArrowRight":
        this._executor.execute("right");
        break;
      case "Space":
        if (this._drawUnit.isPenDown) {
          this._executor.execute("penUp");
        } else {
          this._executor.execute("penDown");
        }
        break;
      case "KeyC":
        if (confirm("Clear drawing?")) {
          this._executor.execute("reset");
        }
        break;
    }
  }
}
