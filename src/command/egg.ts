import { Argv, Arguments } from "yargs";
import { execSync } from "child_process";
export const command = "egg";

export const desc = "Eggjs 辅助工具";

export const builder = (yargs: Argv) => {
  return yargs
    .positional("type", {
      choices: ["install"],
      description: "安装插件",
    })
    .positional("name", {
      description: "插件名称: converoute，获取其他 egg-xx 插件",
    });
};

export const handler = (args: any) => {
  const { type, name } = args;
  // exec(script);
  execSync(`yarn install ${name}`);

  // 修改 config/plugin.js
};
