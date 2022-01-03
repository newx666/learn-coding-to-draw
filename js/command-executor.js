/**
 * @typedef {string} Command
 * @typedef {string | null | undefined} Argument
 * @typedef {import("./draw-unit").DrawUnit} DrawUnit
 * @typedef {import("./types").CommandDefinition} CommandDefinition
 */

/**
 * @enum {Command}
 */
const COMMANDS = {
  PEN_UP: "pen_up",
  PEN_DOWN: "pen_down",
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
    argument = argument ?? 1;
    const diff = this._parseNaturalNumberArgument(argument);
    if (this._drawUnit.penPosition.y - diff < 0) {
      throw new Error("The pen is out of field top");
    }
    this._drawUnit.moveOffset(0, -diff);
  }

  /**
   * @private
   * @param {Argument} argument
   */
  _execDown(argument) {
    argument = argument ?? 1;
    const diff = this._parseNaturalNumberArgument(argument);
    if (this._drawUnit.penPosition.y + diff > this._drawUnit.fieldSize.height) {
      throw new Error("The pen is out of field bottom");
    }
    this._drawUnit.moveOffset(0, diff);
  }

  /**
   * @private
   * @param {Argument} argument
   */
  _execLeft(argument) {
    argument = argument ?? 1;
    const diff = this._parseNaturalNumberArgument(argument);
    if (this._drawUnit.penPosition.x - diff < 0) {
      throw new Error("The pen is out of field left");
    }
    this._drawUnit.moveOffset(-diff, 0);
  }

  /**
   * @private
   * @param {Argument} argument
   */
  _execRight(argument) {
    argument = argument ?? 1;
    const diff = this._parseNaturalNumberArgument(argument);
    if (this._drawUnit.penPosition.x + diff > this._drawUnit.fieldSize.width) {
      throw new Error("The pen is out of field right");
    }
    this._drawUnit.moveOffset(diff, 0);
  }

  /**
   * @private
   */
  _execReset() {
    this._drawUnit.reset();
  }

  /**
   *
   * @param {Argument} argument
   * @returns {number}
   */
  _parseNaturalNumberArgument(argument) {
    const result = Number(argument);
    if (!Number.isSafeInteger(result) || result < 1) {
      throw new Error("Incorrect number argument");
    }
    return result;
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

/** @type {CommandDefinition} */
export const COMMAND_DEFINITIONS = {
  [COMMANDS.PEN_UP]: {
    allowArguments: false,
  },
  [COMMANDS.PEN_DOWN]: {
    allowArguments: false,
  },
  [COMMANDS.UP]: {
    allowArguments: true,
    defaultArgument: 1,
  },
  [COMMANDS.DOWN]: {
    allowArguments: true,
    defaultArgument: 1,
  },
  [COMMANDS.LEFT]: {
    allowArguments: true,
    defaultArgument: 1,
  },
  [COMMANDS.RIGHT]: {
    allowArguments: true,
    defaultArgument: 1,
  },
  [COMMANDS.RESET]: {
    allowArguments: true,
    defaultArgument: 1,
  },
};
