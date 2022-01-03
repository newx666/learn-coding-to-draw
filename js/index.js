"use strict";

import { CommandExecutor, COMMAND_DEFINITIONS } from "./command-executor.js";
import { CommandParser } from "./command-parser.js";
import { DrawUnit } from "./draw-unit.js";
import { KeyBinder } from "./key-binder.js";

const root = document.getElementById("app");
const canvasArea = root.querySelector(".canvas-area");
const bindKB = root.querySelector(".bind-kb");

/** @type {HTMLTextAreaElement} */
const codeInput = root.querySelector(".code");

/** @type {HTMLButtonElement} */
const runCodeBtn = root.querySelector(".code-run");

/** @type {HTMLButtonElement} */
const resetBtn = root.querySelector(".reset-btn");

if (!canvasArea) {
  throw new Error("Not found root element");
}

if (!bindKB) {
  throw new Error("Not found bind keyboard button element");
}

const drawUnit = new DrawUnit({ root: canvasArea, width: 800, height: 600 });
const executor = new CommandExecutor(drawUnit);
drawUnit.reset();

const keyBinder = new KeyBinder(executor, drawUnit);
const BIND_KB_TEXT = "Bind keyboard";
const UNBIND_KB_TEXT = "Unbind keyboard";

bindKB.innerText = BIND_KB_TEXT;
let isKeyBind = false;

bindKB.addEventListener("click", () => {
  isKeyBind = !isKeyBind;
  if (isKeyBind) {
    bindKB.innerText = UNBIND_KB_TEXT;
    keyBinder.enable();
  } else {
    bindKB.innerText = BIND_KB_TEXT;
    keyBinder.disable();
  }
});

const commandParser = new CommandParser({
  definitions: COMMAND_DEFINITIONS,
});

runCodeBtn.addEventListener("click", () => {
  const commands = commandParser.parse(codeInput.value);
  for (const { command, argument } of commands) {
    executor.execute(command, argument);
  }
});

resetBtn.addEventListener("click", () => {
  executor.execute("reset");
});
