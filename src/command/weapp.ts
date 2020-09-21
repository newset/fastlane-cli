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

export const handler = (args: Argv) => {
  release();
};

export const builder = (yargs: Argv) => {
  yargs
    .positional("action", {
      description: "操作",
      choices: ["add", "release"],
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
async function release() {}

async function add() {}

export const command = "weapp <action>";

export const desc = "小程序工具集";
