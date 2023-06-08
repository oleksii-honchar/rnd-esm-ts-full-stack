import path from "path";
import { blablo } from "blablo";
import { __dirname } from "scripts/esm-utils.js";
import { createRequire } from "module";

import { PurgeFromTsx } from "./libs/purge-from-tsx.ts";

const require = createRequire(import.meta.url);
const logHeader = "[config:purge-css]".cyan;
blablo.cleanLog(logHeader, "config loaded");

export const purgeCssConfig = require("@fullhuman/postcss-purgecss")({
  content: [
    path.join(__dirname(), "../src/**/*.html"),
    path.join(__dirname(), "../src/**/*.hbs"),
    path.join(__dirname(), "../src/**/*.jsx"),
    path.join(__dirname(), "../src/**/*.tsx"),
    path.join(__dirname(), "../src/pages/Root/components/Navigation.tsx"),
  ],
  extractors: [
    {
      extractor: PurgeFromTsx.extract,
      extensions: ["tsx"],
    },
  ],
});
