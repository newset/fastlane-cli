const presets = {
  cli: ["bat", "fd"],
  benchmark: ["hyperfine"],
  net: ["bandwhich"],
};

import { Argv } from "yargs";
import { execSync } from "child_process";
export const command = "app";

export const desc = "根据preset安装程序";

export const builder = (yargs: Argv) => {
  return yargs.positional("preset", {
    description: "预设",
    choices: Object.keys(presets),
  });
};

export const handler = () => {
  // 添加 query
  const command = `brew install ${presets.cli.join(" ")}`;
  execSync(command);
};
