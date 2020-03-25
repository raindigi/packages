import { Command } from "@oclif/command";
import { exec, cd } from "shelljs";
import { join, resolve } from "path";
import { writeFile, readJson } from "fs-extra";

const DIR = resolve(join(".staart"));

export default class BuildBabel extends Command {
  static description = "build your Staart API app with Babel";

  async run() {
    let staartRc: any = {};
    try {
      staartRc = await readJson(join(".", ".staartrc"));
    } catch (error) {}

    const babelRc = {
      presets: ["@babel/env", "@babel/typescript"],
      plugins: [
        ["@babel/plugin-transform-runtime"],
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
      ],
      ...(staartRc.babel || {})
    };

    await writeFile(join(DIR, ".babelrc"), babelRc);
    cd(".staart");
    exec(
      'babel src --out-dir ../dist/src --extensions ".ts,.tsx" --source-maps inline'
    );
    cd("../");
  }
}
