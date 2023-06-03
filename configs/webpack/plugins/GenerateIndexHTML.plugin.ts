import webpack from "webpack";

import colors from "colors";
import { generateIndexHtml } from "../libs/generateIndexHtml.ts";

const { Compilation, sources } = webpack;

colors.enable();
export default class GenerateIndexHTML {
  env = [];
  constructor(env: any = {}) {
    this.env = env;
  }
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap("Replace", (compilation: any) => {
      compilation.hooks.processAssets.tap(
        {
          name: "Replace",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          // get the file main.js
          console.log(
            "[GenerateIndexHTML:plugin]".cyan,
            "processing asset",
            "index.hbs".green.bold,
            "❱",
            "dist/index.html".green.bold,
          );
          generateIndexHtml(this.env);
        },
      );
    });
  }
}
