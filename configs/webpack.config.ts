import { merge } from "webpack-merge";
import colors from "colors";
import { blablo } from "blablo";

import pkg from "package.json" assert { type: "json" };

import { baseConfig } from "./webpack/base.config.ts";
import { moduleConfig } from "./webpack/module.config.ts";
import { cssModuleConfig } from "./webpack/module-css.config.ts";
import { devServerConfig } from "./webpack/dev-server.config.ts";
import { prodConfig } from "./webpack/prod.config.ts";
import { externalsConfig } from "./webpack/externals.config.ts";
import GenerateIndexHTML from "./webpack/plugins/GenerateIndexHTML.plugin.ts";

colors.enable();
const logHeader = "[webpack:config]".cyan;
blablo.cleanLog(logHeader, `starting "${pkg.name}" config composition`);

export const configFactory = (env: any = {}, argv: { mode: string }) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  blablo.cleanLog(logHeader, `using "${process.env.NODE_ENV}" mode`);

  const envES2022 = { ...env, TS_TARGET: "es2022" };

  let cfgES2022 = baseConfig(envES2022); // @ts-ignore
  cfgES2022 = merge(cfgES2022, moduleConfig(envES2022)); // @ts-ignore
  cfgES2022 = merge(cfgES2022, cssModuleConfig(env)); // @ts-ignore
  cfgES2022 = merge(cfgES2022, externalsConfig);

  cfgES2022 = merge(cfgES2022, {
    // @ts-ignore
    entry: {
      app: "./src/index.tsx",
    },
    plugins: [new GenerateIndexHTML(env)],
  });

  if (argv.mode === "development") {
    // @ts-ignore
    cfgES2022 = merge(cfgES2022, devServerConfig(envES2022));
  }

  if (process.env.NODE_ENV !== "production") {
    blablo.cleanLog("[webpack:config] config composition completed");
    return cfgES2022;
  }
  // @ts-ignore
  cfgES2022 = merge(cfgES2022, prodConfig);

  blablo.cleanLog("[webpack:config]".cyan, "config composition completed");
  return cfgES2022;
};
