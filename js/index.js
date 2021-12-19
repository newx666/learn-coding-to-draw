"use strict";

import { App } from "./draw-unit.js";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Not found root element");
}

const app = new App({ root, width: 800, height: 600 });

app.reset();

window.APP = app;