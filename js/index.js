"use strict";

import { App } from "./app.js";

const root = document.getElementById("app");
if (!root) {
  throw new Error("Not found root element");
}

const app = new App({ root, width: 800, height: 600 });

app.reset();
