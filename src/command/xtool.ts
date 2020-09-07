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
  // 安装 Homebrew, 先检查brew后再执行
  // /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  // 更新homebrew 仓库
  // exec(script);
  // 安装 oh-my-zsh
  // sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
  // 编辑 .zshrc
  // plugins=(git
  //     z
  //     pkg
  //     sublime
  //     zsh-autosuggestions
  //     vscode
  //     zsh_reload
  //     colored-man-pages
  //     zsh-syntax-highlighting
  //     sudo
  // )
  // brew cask install iterm2
};
