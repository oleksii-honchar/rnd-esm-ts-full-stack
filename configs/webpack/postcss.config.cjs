const purgeCss = require('./purgecss.config.cjs');

const logHeader = "[config:post-css]".cyan;
console.log(logHeader, "config loaded");

module.exports = ({ file, options, env }) => ({
  plugins: [
    require("postcss-import")({ root: file.dirname }),

    require("tailwindcss"),

    options["postcss-preset-env"]
      ? require("postcss-preset-env")({
          stage: 3,
          features: {
            'nesting-rules': true
          }
        })
      : false,

    env === "production"
      ? require("cssnano")({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            }
          ]
        })
      : require("postcss-discard-comments"),

    env === "production"
      ? purgeCss
      : false
  ]
});
