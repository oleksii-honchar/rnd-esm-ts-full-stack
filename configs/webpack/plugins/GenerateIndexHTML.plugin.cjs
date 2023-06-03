const {Compilation, sources} = require('../../webpack-wrapper.ts');
const colors = require("colors");
const generateIndexHtml = require("../libs/generateIndexHtml.cjs");

colors.enable();
class GenerateIndexHTML {
  env = [];
  constructor (env) {
    this.env = env;
  };
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Replace', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'Replace',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          // get the file main.js
          console.log('[GenerateIndexHTML:plugin]'.cyan, 'processing asset', 'index.hbs'.green.bold,'❱', 'dist/index.html'.green.bold)
          generateIndexHtml(this.env);
        }
      );
    });
  }
}

module.exports = {
  GenerateIndexHTML
}
