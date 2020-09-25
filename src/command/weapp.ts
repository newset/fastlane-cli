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
  dest?: string;
}

export const handler = async (args: ArgType) => {
  const { action, name } = args;
  switch (action) {
    case "release":
      await release(args);
      break;
    case "add":
      const { dest } = args;
      await scalffold(
        name as PresetType,
        dest.endsWith("/") ? dest + name : dest,
        {
          name,
        }
      );
      break;
    default:
      break;
  }
};

export const builder = (yargs: Argv) => {
  yargs
    .positional("action", {
      description: "操作",
      required: true,
      choices: ["add", "release"],
    })
    .positional("name", {
      description: "插件名称",
      choices: ["sso"],
    })
    .option("version", { default: process.env.CI_VERSION })
    .option("dest", {
      description: "自定义安装目录, 注意斜杠结尾",
      default: "package/",
    })
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

export const command = "weapp <action> [name]";

export const desc = "小程序工具集";
