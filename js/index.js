"use strict";

import { CommandExecutor } from "./command-executor.js";
import { DrawUnit } from "./draw-unit.js";
import { KeyBinder } from "./key-binder.js";

const root = document.getElementById("app");
const bindKB = document.getElementById("bind-kb");

if (!root) {
  throw new Error("Not found root element");
}

if (!bindKB) {
  throw new Error("Not found bind keyboard button element");
}

const drawUnit = new DrawUnit({ root, width: 800, height: 600 });
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


window.EX = executor;
window.APP = drawUnit;
