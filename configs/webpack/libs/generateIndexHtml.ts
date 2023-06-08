import fs from "fs";
import path from "path";
import hbs from "handlebars";
import { __dirname } from "scripts/esm-utils.ts";

export function generateIndexHtml(env: any = {}) {
  const data = {
    scriptEnvSuffix: process.env.NODE_ENV === "development" ? "development" : "production.min",
  };

  const tmplPath = path.join(__dirname(), "../src/assets/index.hbs");
  const source = fs.readFileSync(tmplPath, "utf-8");

  const tmpl = hbs.compile(source);
  const html = tmpl(data);

  const destPath = path.join(__dirname(), "../dist/");
  try {
    fs.mkdirSync(destPath, { recursive: true });
  } catch (e) {
    console.error(e);
  }
  fs.writeFileSync(destPath + "index.html", html, "utf8");
}
