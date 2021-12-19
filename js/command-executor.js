/**
 * @typedef {string} Command
 * @typedef {string | null | undefined} Argument
 * @typedef {import("./draw-unit").DrawUnit} DrawUnit
 */

/**
 * @enum {Command}
 */
const COMMANDS = {
  PEN_UP: "penUp",
  PEN_DOWN: "penDown",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  RESET: "reset",
};

const COMMAND_METHOD_MAP = {
  [COMMANDS.PEN_UP]: "_execPenUp",
  [COMMANDS.PEN_DOWN]: "_execPenDown",
  [COMMANDS.UP]: "_execUp",
  [COMMANDS.DOWN]: "_execDown",
  [COMMANDS.LEFT]: "_execLeft",
  [COMMANDS.RIGHT]: "_execRight",
  [COMMANDS.RESET]: "_execReset",
};

export class CommandExecutor {
  /**
   *
   * @param {DrawUnit} drawUnit
   */
  constructor(drawUnit) {
    this._drawUnit = drawUnit;
  }

  /**
   *
   * @param {Command} command
   * @param {Argument} argument
   * @returns {this}
   */
  execute(command, argument = null) {
    const method = COMMAND_METHOD_MAP[command];
    if (!method) {
      throw new ExecuteCommandError(
        `Unknown command '${command}'`,
        command,
        argument
      );
    }
    try {
      this[method](argument);
    } catch (e) {
      if (!(e instanceof ExecuteCommandError)) {
        e = new ExecuteCommandError(e.message, command, argument);
      }
      throw e;
    }
    return this;
  }

  /**
   * @private
   */
  _execPenUp() {
    this._drawUnit.penUp();
  }

  /**
   * @private
   */
  _execPenDown() {
    this._drawUnit.penDown();
  }

  /**
   * @private
   * @param {Argument} argument
   */
  _execUp(argument) {
    const diff = this._parseNaturalNumberArgument(argument);
    if (this._drawUnit.penPosition.y - diff < 0) {
      throw new Error("The pen is out of field top");
    }
    this._drawUnit.moveOffset(0, diff);
  }

  /**
   *
   * @param {Argument} argument
   * @returns {number}
   */
  _parseNaturalNumberArgument(argument) {
    const result = Number(argument);
    if (!Number.isSafeInteger() || result < 1) {
      throw new Error("Incorrect number argument");
    }
  }
}

export class ExecuteCommandError extends Error {
  /**
   *
   * @param {string} message error message
   * @param {Command} command executed command
   * @param {Argument} argument command's argument
   */
  constructor(message, command, argument = undefined) {
    super(message);

    /**
     * @type {Command}
     * @protected
     */
    this._command = command;

    /**
     * @type {Argument}
     * @protected
     */
    this._argument = argument;
  }

  /**
   * @type {Command}
   * @readonly
   */
  get command() {
    return this._command;
  }

  /**
   * @type {Argument}
   * @readonly
   */
  get argument() {
    return this._argument;
  }
}
