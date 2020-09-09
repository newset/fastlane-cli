import { Argv } from "yargs";
import { getTemplate } from "../utils";

const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");

import { load } from "../utils";

type Context = Argv & {
  name?: string;
  dist?: string;
  force?: boolean;
};

export const builder = (yargs: Argv) => {
  return yargs
    .positional("name", {
      description: "子包名称",
    })
    .options({
      force: {
        description: "是否覆盖安装",
        alias: "f",
        default: false,
        type: "boolean",
      },
      dist: {
        describe: "包输出的位置，默认为package目录",
        alias: "d",
        default: "package",
      },
    });
};

const cwd = process.cwd();

export async function handler(context: Context) {
  const { name, dist, force } = context;
  ora().start().info(`开始安装${name}插件`);

  const destination = path.join(cwd, dist, name);
  const tempDir = await load(
    getTemplate(name, "subpackage"),
    "下载插件",
    "插件下载完毕"
  );

  // 检查目录是否存在
  if (fs.existsSync(destination) && !force)
    return console.log("目录以存在，如果需要覆盖，添加-f 参数");

  await fs.move(tempDir, destination, { overwrite: true });
}

export const command = "subpackage <name>";

export const desc = "安装子包";
