/**
 * tool 命令相关环境变量
 * COS_TOKEN_URL : 获取cos 临时token 的服务
 * COS_APP_ID: COS bucket对应的APP_ID
 */

import { Argv } from "yargs";
import { getAuth, upload, search } from "../utils/cdn";
import { getQr } from "../utils/qr";
const XTOOL_URL = "https://github.com/goingta/xtool";

const script = `
git clone ${XTOOL_URL} --depth 1 .temp/xtool
cd .temp/xtool
sh setup.sh
`;

type Context = Argv & {
  action?: string;
};

export const command = "tool <action>";

export const desc = "其他工具";

export const builder = (yargs: Argv) => {
  return yargs
    .positional("action", {
      choices: ["cos", "put", "search", "qr"],
    })
    .options({
      region: {
        description: "cos region",
      },
      bucket: {
        description: "cos bucket",
        default: "public-10000230",
        defaultDescription:
          "'public-10000230', 'files-10000230', 'js-10000230', 'private-10000230'",
      },
      from: {
        description: "上传目录或文件，使用glob pattern",
      },
    });
};

export const handler = async (argv: Context) => {
  // brew cask install iterm2
  switch (argv.action) {
    case "cos":
      await getAuth();
      break;
    case "put":
      await upload(argv);
      break;
    case "search":
      await search(argv);
      break;
    case "qr":
      await getQr(argv);
      break;
    default:
  }
};
