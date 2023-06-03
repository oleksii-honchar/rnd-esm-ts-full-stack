const {Compilation, sources} = require('../../webpack-wrapper.ts');
const { exec } = require('child_process');
const { promisify } = require('util');
import * as emoji from 'node-emoji';

const colors = require("colors");

colors.enable();
const execAsync = promisify(exec);
const emoSparkles = emoji.get(emoji.find('✨')?.key ?? '');

/**
 * Some of the open-source lib creating additional license files on build. Let's prune them
 */
export class PruneLicenseFilesInDist {
  outputPath = [];
  constructor (outputPath) {
    this.outputPath = outputPath;
  };
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Replace', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'Replace',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          console.log('[PruneLicenseFilesInDist:plugin]'.cyan, 'looking *.LICENCE.txt to prune in:', this.outputPath.yellow);
          console.log('[PruneLicenseFilesInDist:plugin]'.cyan, `Done ${emoSparkles}`);
        }
      );
    });
  }
}
