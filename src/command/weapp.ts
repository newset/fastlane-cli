/**
 * fl weapp add sso
 * fl weapp import
 * fl weapp release
 *
 * WEAPP_CI_KEY: 小程序秘钥
 * CI_VERSION: 小程序版本
 * CI_MESSAGE: 上传描述
 */

import { Argv } from "yargs";
import scalffold, { PresetType } from "../utils/scaffold";

interface ArgType {
  action: string;
  version?: string;
  desc?: string;
  name?: string;
}

export const handler = async (args: ArgType) => {
  switch (args.action) {
    case "release":
      await release(args);
      break;
    case "add":
      await add(args.name as PresetType);
      break;
    default:
      break;
  }
};

export const builder = (yargs: Argv) => {
  yargs
    .positional("action", {
      description: "操作",
      choices: ["add", "release"],
    })
    .option("name", {
      description: "插件名称",
      choices: ["sso"],
    })
    .option("version", { default: process.env.CI_VERSION })
    .option("desc", {
      default: process.env.CI_MESSAGE,
    });
};

/**
 * 小程序发布功能
 * 1、获取cdn session token
 * 2、使用ci发布版本
 * 3、上传 dist/.asset 目录
 *
 * 命令行参数: --version --desc
 */
async function release(context: ArgType) {}

async function add(name: PresetType) {
  await scalffold(name, `package/${name}`);
}

export const command = "weapp <release|add>";

export const desc = "小程序工具集";
