/**
 * @typedef {import("./types").CommandParserOptions} CommandParserOptions
 * @typedef {import("./types").ParsedCommand} ParsedCommand
 * @typedef {import("./types").ParsedCommandSeries} ParsedCommandSeries
 */

const CMD_LINE_RE = /([^\s]+)\s*(.*)\s*/;
export class CommandParser {
  /**
   * @param {CommandParserOptions} options
   */
  constructor(options) {
    if (!options) {
      throw new TypeError("Expect options");
    }

    /**
     * @protected
     * @type {CommandParserOptions}
     */
    this._options = options;
  }

  /**
   * @param {string} str
   * @returns {ParsedCommandSeries}
   */
  parse(str) {
    const lines = str.split("\n").map((item) => item.trim());
    /** @type {ParsedCommandSeries} */
    const result = [];
    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      const line = lines[i];
      if (!line) {
        continue;
      }
      try {
        result.push(this._parseCommandByLine(line));
      } catch (e) {
        throw new CommandParseError(e.message, lineNumber, line);
      }
    }
    return result;
  }

  /**
   * @param {string} line
   * @returns {ParsedCommand}
   */
  _parseCommandByLine(line) {
    const match = CMD_LINE_RE.exec(line);
    if (!match) {
      throw new Error("Unexpected command line syntax");
    }
    const [, command, argument] = match;
    const definition = this._options.definitions[command];
    if (!definition) {
      throw new Error(`Unknown command: "${command}"`);
    }
    const { allowArguments, defaultArgument } = definition;
    if (!allowArguments && argument) {
      throw new Error(`Unexpected argument for command "${command}"`);
    }
    /** @type {ParsedCommand} */
    const result = { command };
    if (allowArguments) {
      result.argument = argument || defaultArgument;
    }
    return result;
  }
}

export class CommandParseError extends Error {
  /**
   * @param {string} message
   * @param {number} lineNumber
   * @param {string} lineContent
   */
  constructor(message, lineNumber, lineContent) {
    super(message);

    /**
     * @protected
     * @type {number}
     */
    this._lineNumber = lineNumber;

    /**
     * @protected
     * @type {string}
     */
    this._lineContent = lineContent;
  }

  /**
   * @readonly
   * @type {number}
   */
  get lineNumber() {
    return this._lineNumber;
  }

  /**
   * @readonly
   * @type {string}
   */
  get lineContent() {
    return this._lineContent;
  }
}
