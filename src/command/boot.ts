/**
 * fl boot mac
 */

import yargs, { Argv } from "yargs";
const ora = require("ora");
const promisify = require("util").promisify;
const path = require("path");
const exec = promisify(require("child_process").exec);
const execSync = require("child_process").execSync;

const { spawn } = require("../utils/shell");

export const command = "boot [os]";
export const desc = "初始化 新电脑";

export const builder = (yargs: Argv) =>
  yargs
    .positional("os", {
      description: "操作系统",
      default: "mac",
    })
    .options({
      iterm: {
        alias: "i",
        desciption: "是否安装iterm2",
      },
      brew: {
        type: "boolean",
        alias: "b",
        desciption: "是否强制重新安装Homebrew",
      },
    });

export const brew = async (force = false) => {
  // 安装 Homebrew, 先检查brew后再执行
  try {
    execSync("which brew");

    if (!force) return;
    ora().start().info("重装Homebrew...");
  } catch (err) {
    ora().start().info("安装Homebrew...");
  }
  await spawn("./shell/brew.sh");
};

export const zsh = async function () {
  const fs = require("fs-extra");
  const home = process.env.HOME;
  // 检查 目录
  if (!fs.existsSync(path.join(home, ".oh-my-zsh"))) {
    // 安装 oh-my-zsh
    await spawn("./shell/zsh.sh");
  }
  // 编辑 .zshrc
  const plugins = "git z sublime zsh-autosuggestions vscode zsh_reload colored-man-pages zsh-syntax-highlighting sudo".split(
    " "
  );
  const zshrc = path.join(home, ".zshrc");
  // 读取 .zshrc
  const plugin_reg = /\nplugins=\(([^)]+)/;
  const rc = fs.readFileSync(zshrc, { encoding: "utf-8" });
  const [, enabled] = plugin_reg.exec(rc);
  const set = new Set([
    ...plugins,
    ...enabled
      .replace(/[\r\n\s]+/g, " ")
      .split(" ")
      .filter(Boolean),
  ]);
  const merged = Array.from(set);
  const modified = rc.replace(
    plugin_reg,
    "\nplugins=(" + merged.join("\n\t") + "\n"
  );
  fs.writeFile(zshrc, Buffer.from(modified));
};

type CommandArg = {
  brew: boolean;
};

export const handler = async (args: CommandArg) => {
  ora().start().info("开始准备基础开发工具...");

  await zsh();

  await brew(args.brew);

  ora().start().info("更新 brew 仓库");
  await spawn("./shell/repo.sh");
};
