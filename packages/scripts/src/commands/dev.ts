import { Command } from "@oclif/command";
import { exec, touch, mkdir, cp } from "shelljs";
import { success, pending } from "@staart/errors";
import watch from "node-watch";
import { join } from "path";
import child_process from "child_process";

export default class Dev extends Command {
  static description =
    "start a local development server for your Staart API app";

  async run() {
    exec("staart build");
    success("Completed build process");
    let nodeProcess = child_process.exec(
      "node dist/src/__staart.js",
      (err, stdout) => console.log(stdout)
    );
    success("Launched app");
    watch(join("src"), { recursive: true }, () => {
      pending("Rebuilding app...");
      touch(".env");
      mkdir("-p", ".staart");
      cp(".env", ".staart/.env");
      cp("-r", "src", ".staart");
      cp("-r", "static", ".staart");
      cp("package.json", ".staart");
      exec("staart controllers");
      exec("staart build-babel");
      pending("Relaunching app...");
      nodeProcess.kill();
      nodeProcess = child_process.exec(
        "node dist/src/__staart.js",
        (err, stdout) => console.log(stdout)
      );
    });
  }
}
