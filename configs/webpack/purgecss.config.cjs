const path = require("path");
const PurgeFromTsx = require("./libs/purge-from-tsx.cjs");

const logHeader = "[config:purge-css]".cyan;
console.log(logHeader, "config loaded");

module.exports = require("@fullhuman/postcss-purgecss")({
  content: [
    path.join(__dirname, "../../src/**/*.html"),
    path.join(__dirname, "../../src/**/*.hbs"),
    path.join(__dirname, "../../src/**/*.jsx"),
    path.join(__dirname, "../../src/**/*.tsx"),
    path.join(__dirname, "../../src/pages/Root/components/Navigation.tsx")
  ],
  extractors: [
    {
      extractor: PurgeFromTsx.extract,
      extensions: ['tsx']
    }
  ]
});