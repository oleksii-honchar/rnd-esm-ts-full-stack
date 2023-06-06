import webpack from "webpack";
import { exec } from "child_process";
import { promisify } from "util";
import * as emoji from "node-emoji";

import colors from "colors";
import { blablo } from "blablo";

const { Compilation, sources } = webpack;

colors.enable();
const execAsync = promisify(exec);
const emoSparkles = emoji.get(emoji.find("✨")?.key ?? "");

/**
 * Some of the open-source lib creating additional license files on build. Let's prune them
 */
export class PruneLicenseFilesInDist {
  outputPath = "";
  constructor(outputPath: string) {
    this.outputPath = outputPath;
  }
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap("Replace", (compilation: any) => {
      compilation.hooks.processAssets.tap(
        {
          name: "Replace",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          blablo.log(
            "[plugin:PruneLicenseFilesInDist] ".cyan,
            "looking *.LICENCE.txt to prune in:",
            this.outputPath.yellow,
          );
          blablo.chainLog(" ❱ ", `Done ${emoSparkles}`).finish();
        },
      );
    });
  }
}
