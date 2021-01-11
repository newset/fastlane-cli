// 消息工具: 目前只打通企微机器人消息
import * as webhooks from "../utils/ci/webhook";
import { Argv } from "yargs";

export const command = "message <platform>";

export const desc = "消息工具";

export const builder = (yargs: Argv) => {
  return yargs.options({
    platform: {
      type: "string",
    },
  });
};

/**
 *
 */
export const handler = async (args: any) => {
  await webhooks.workwechat();
};
