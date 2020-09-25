import { load, getTemplate, copyFiles } from "./index";
const ora = require("ora");

const template = (name: TemplateStringsArray) =>
  `gitlab.aihaisi.com:qiexr/public-group/templates/${name}.git`;
const subpackage = (name: TemplateStringsArray) =>
  `gitlab.aihaisi.com:qiexr/public-group/subpackage/${name}.git`;

interface Presets {
  admin: string;
  hybrid: string;
  nodejs: string;
  cli: string;
  sso: string;
}

const presets: Presets = {
  admin: template`admin`,
  nodejs: template`nodejs`,
  hybrid: template`hybrid`,
  cli: template`cli`,
  sso: subpackage`sso`,
};

// 项目顺序需要保持正确
export const createChoices = ["hybrid", "admin", "nodejs", "cli"];
export const weappChoices = ["sso", "payment"];

export type PresetType = keyof Presets;

export default async (scafoldType: PresetType, dest: string, context?: any) => {
  ora().start().info(`开始安装${scafoldType}`);

  const templateDir = await load(
    getTemplate(scafoldType, presets[scafoldType]),
    "下载开始",
    "下载完毕"
  );

  console.log("开始生成项目文件: ");
  const spinner = ora("拷贝文件: ").start();

  copyFiles({ dir: templateDir, dest }, context, (file: string) => {
    spinner.succeed(`copy ${file.replace("./", "")}`);
  });

  spinner.stop();
};
