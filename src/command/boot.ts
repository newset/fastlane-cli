/**
 * fl boot mac
 */

import { Argv } from "yargs";
const ora = require("ora");
const promisify = require("util").promisify;
const path = require("path");
const exec = promisify(require("child_process").exec);
const execSync = require("child_process").execSync;

const { spawn } = require("../utils/shell");

export const command = "boot [os]";
export const desc = "初始化 新电脑";

export const builder = (yargs: Argv) => {
  return yargs
    .positional("os", {
      description: "操作系统",
      default: "mac",
    })
    .options({
      iterm: {
        alias: "i",
        desciption: "是否安装iterm2",
      },
    });
};

export const brew = async () => {
  const tsinghua = (git: TemplateStringsArray) =>
    `https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/${git}`;
  const core = "homebrew-core.git";
  // 安装 Homebrew, 先检查brew后再执行
  try {
    execSync("which brews");
  } catch (err) {
    await spawn("./shell/brew.sh");
  }
};

export const zshrc = function () {
  // 编辑 .zshrc
  const plugins =
    "git z pkg sublime zsh-autosuggestions vscode zsh_reload colored-man-pages zsh-syntax-highlighting sudo";

  // 读取 .zshrc
};

export const handler = async (args: Argv) => {
  ora().start().info("开始准备基础开发工具...");
  // 安装 oh-my-zsh
  await spawn("./shell/zsh.sh");

  await brew();

  ora().start().info("更新 brew 仓库");
  await spawn("./shell/repo.sh");
};
