import { load, getTemplate, writeFile } from "./index";
const ora = require("ora");
const glob = require("glob");

const template = (name: TemplateStringsArray) =>
  `gitlab.aihaisi.com:qiexr/public-group/templates/${name}`;
const subpackage = (name: TemplateStringsArray) =>
  `gitlab.aihaisi.com:qiexr/public-group/subpackage/${name}`;

const presets: {
  [key: string]: string;
} = {
  admin: template`admin`,
  nodejs: template`admin`,
  hybrid: template`admin`,
  sso: subpackage`admin`,
};

export type PresetType = "admin" | "nodejs" | "hybrid" | "sso";

export default async (name: PresetType, dest: string, context?: any) => {
  ora().start().info(`开始安装${name}`);

  const templateDir = await load(
    getTemplate(name, presets[name]),
    "下载开始",
    "下载完毕"
  );

  const files: [string] = glob.sync("./**", {
    cwd: templateDir,
    dot: true,
    nodir: true,
  });

  console.log("开始生成项目文件: ");
  const spinner = ora("拷贝文件: ").start();
  for (let file of files) {
    try {
      writeFile(file, { context, dir: templateDir, dest });
    } catch (error) {
      spinner.fail(`fail: ${file}`);
      console.log(error);
      return;
    }

    spinner.succeed(`copy ${file.replace("./", "")}`);
  }

  spinner.stop();
};
