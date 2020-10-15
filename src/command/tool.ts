import { Argv } from "yargs";
import { getAuth, upload } from "../utils/cdn";
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

export const desc = "安装 xtool";

export const builder = (yargs: Argv) => {
  return yargs
    .positional("action", {
      choices: ["cos"],
    })
    .options({
      prefix: {
        description: "cos 前缀",
      },
    });
};

export const handler = async (argv: Context) => {
  // brew cask install iterm2
  switch (argv.action) {
    case "cos":
      await getAuth();
      await upload({});
      break;
    default:
  }
};
