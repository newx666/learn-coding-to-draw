"use strict";

import { CommandExecutor } from "./command-executor.js";
import { DrawUnit } from "./draw-unit.js";
import { KeyBinder } from "./key-binder.js";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Not found root element");
}

const drawUnit = new DrawUnit({ root, width: 800, height: 600 });
const executor = new CommandExecutor(drawUnit);
const keyBinder = new KeyBinder(executor, drawUnit);
keyBinder.enable();

drawUnit.reset();

window.EX = executor;
window.APP = drawUnit;