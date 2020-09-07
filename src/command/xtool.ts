import { exec } from "child_process";

const XTOOL_URL = "https://github.com/goingta/xtool";

const script = `
git clone ${XTOOL_URL} --depth 1 .temp/xtool
cd .temp/xtool
sh setup.sh
`;

export const command = "xtool";

export const desc = "安装 xtool";

export const builder = () => {};

export const handler = () => {
  // brew cask install iterm2
};
