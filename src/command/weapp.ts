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
import scalffold, { PresetType, getTemplateUrl } from "../utils/scaffold";
import ci from "../utils/ci";

interface ArgType {
  action: string;
  version?: string;
  desc?: string;
  name?: string;
  dest?: string;
}

export const handler = async (args: ArgType) => {
  const { action, name, desc, version } = args;
  switch (action) {
    case "preview":
      ci.preview({ desc });
      break;
    case "release":
      await ci.upload({
        desc,
        version,
      });
      break;
    case "add":
      const { dest } = args;
      // 查询 presets
      const url = await getTemplateUrl(name, "weapp-add");
      await scalffold(url, dest.endsWith("/") ? dest + name : dest, {
        ...args,
        action: "weapp-add",
      });
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
      choices: ["add", "release", "preview"],
    })
    .positional("name", {
      description: "插件名称",
    })
    .option("version", { default: process.env.CI_COMMIT_TAG })
    .option("dest", {
      description: "自定义安装目录, 注意斜杠结尾",
      default: "package/",
    })
    .option("desc", {
      default: process.env.CI_COMMIT_MESSAGE,
    });
};

export const command = "weapp <action> [name]";

export const desc = "小程序工具集";
