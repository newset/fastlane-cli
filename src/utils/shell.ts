const util = require("util");
const path = require("path");
const promisify = util.promisify;

export const spawn = async (file: string) => {
  const spawn = promisify(require("child_process").spawn);
  await spawn("sh", [file], {
    cwd: path.resolve(__dirname, "../../"),
    stdio: ["pipe", process.stdout, process.stderr],
    encoding: "utf-8",
  });
};
