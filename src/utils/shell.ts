const util = require("util");
const path = require("path");
const tar = require("tar");
const promisify = util.promisify;

export const spawn = async (file: string) => {
  const spawn = promisify(require("child_process").spawn);
  await spawn("sh", [file], {
    cwd: path.resolve(__dirname, "../../"),
    stdio: ["pipe", process.stdout, process.stderr],
    encoding: "utf-8",
  });
};

export const exec = async (code: string, opts: any) => {
  const run = promisify(require("child_process").exec);

  await run(code, {
    ...opts,
    stdio: ["pipe", process.stdout, process.stderr],
    encoding: "utf-8",
  });
};

export { tar };
