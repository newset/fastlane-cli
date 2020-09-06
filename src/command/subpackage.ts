import { Argv } from "yargs";
import { getTemplateUrl } from "../api";

import cp from "child_process";
const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");

import { load } from "../utils";

type Context = Argv & {
  name?: string;
  dist?: string;
};

export const builder = (yargs: Argv) => {
  return yargs
    .positional("name", {
      description: "子包名称",
    })
    .options({
      dist: {
        describe: "包输出的位置，默认为package目录",
        alias: "d",
        default: "package",
      },
    });
};

const cwd = process.cwd();

export async function handler(context: Context) {
  const { name, dist } = context;
  ora().start().info(`开始安装${name}插件`);

  const tempDir = path.join(cwd, name);

  const destination = path.join(cwd, dist, name);
  await load(getSubpackage(name), "下载插件", "插件下载完毕");

  await movePackage(tempDir, destination);
}

const getSubpackage = async (name: string) => {
  const url = getTemplateUrl(name, "subpackage");
  await new Promise((resolve) => {
    const command = `git clone git@${url} --depth 1`;
    // 删除.git
    cp.exec(command, {}, (error: Error) =>
      error ? console.log(error) : resolve()
    );
  });
  await fs.remove(`./${name}/.git`);
};

const movePackage = (tempDir: string, destination: string) =>
  fs.move(tempDir, destination);

export const command = "subpackage <name>";

export const desc = "安装子包";
