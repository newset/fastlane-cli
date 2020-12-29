/**
 * tool 命令相关环境变量
 * COS_TOKEN_URL : 获取cos 临时token 的服务
 * COS_APP_ID: COS bucket对应的APP_ID
 */

import { Argv } from "yargs";
import { Client, getAuth } from "../utils/cdn";

type Context = Argv & {
  action?: string;
};

export const command = "tool <action>";

export const desc = "其他工具";

export const builder = (yargs: Argv) => {
  return yargs
    .positional("action", {
      choices: ["cos", "put", "search"],
    })
    .options({
      region: {
        default: process.env.BUCKET_REGION,
        description: "cos region",
      },
      bucket: {
        description: "cos bucket",
        default: process.env.BUCKET, //"public-10000230",
        defaultDescription:
          "'public-10000230', 'files-10000230', 'js-10000230', 'private-10000230'",
      },
      from: {
        description: "上传目录或文件，使用glob pattern",
        default: "dist",
      },
      prefix: {
        description: "上传文件夹前缀",
        default: "/",
      },
    });
};

export const handler = async (argv: Context) => {
  const client = new Client();

  switch (argv.action) {
    case "cos":
      await getAuth();
      break;
    case "put":
      await client.upload(argv);
      break;
    case "search":
      await client.search(argv);
      break;
    default:
  }
};
