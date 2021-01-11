import * as webhooks from "../utils/ci/webhook";
import { Argv } from "yargs";

export const command = "message <platform>";

export const desc = "创建项目";

export const builder = (yargs: Argv) => {
  return yargs.options({
    platform: {
      type: "string",
    },
  });
};

export const handler = async (args: any) => {
  await webhooks.workwechat();
};
