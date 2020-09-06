import { Arguments, Argv } from "yargs";
import cp from "child_process";
const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");

import { getTemplateUrl } from "../api";
import { load } from "../utils";

const GitUrl = "git@gitlab.aihaisi.com:qiexr/public-group";
const cwd = process.cwd();

type CommandArg = Arguments & {
  name?: string;
  dest?: string;
};

const getSubpackage = async (name: string, handleType: string) => {
  const url = getTemplateUrl(name, handleType);
  await new Promise((resolve) => {
    const command = `git clone ${url} --depth 1`;
    // 删除.git
    cp.exec(command, {}, (error: Error) =>
      error ? console.log(error) : resolve()
    );
  });
  await fs.remove(`./${name}/.git`);
  await fs.remove(`./${name}/.gitignore`);
};

const movePackage = (tempDir: string, destination: string) =>
  fs.move(tempDir, destination);

export const builder = (yargs: Argv) => {
  return yargs.describe("name", "子包名称").options({
    name: {
      describe: "Subpackage在仓库中的包名",
      type: "string",
    },
    dest: {
      describe: "包输出的位置，默认为package目录",
      type: "string",
      default: "package",
    },
  });
};

export const handler = async (args: CommandArg) => {
  const { name, dest } = args;
  ora().start().info(`开始安装${name}插件`);

  const tempDir = path.join(cwd, name);
  const destination = path.join(cwd, dest, name);
  await load(getSubpackage(name, "subpackage"), "下载插件", "插件下载完毕");

  await movePackage(tempDir, destination);
};

export const command = "subpackage <name>";

export const desc = "添加子包";
