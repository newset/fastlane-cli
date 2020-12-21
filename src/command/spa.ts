/**
 * fl spa deploy --from dist/web --tag ${BRANCH} --target dev --matchUrl fd.doctorwork.com
 */

import { Argv } from "yargs";

export const command = "spa [action]";

export const desc = "SPA平台";

export const builder = (yargs: Argv) => {
  return yargs.options({
    action: {
      type: "string",
      choices: ["upload", "deploy"],
    },
    // app参数默认值从 package.json 文件读取
    app: {
      type: "string",
    },
  });
};

export const handler = async (args: Argv) => {};
