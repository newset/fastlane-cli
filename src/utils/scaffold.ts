import { load, getTemplate, copyFiles } from "./index";
const ora = require("ora");
const path = require("path");
import { get } from "./net";

interface Presets {
  [key: string]: string;
}

// 项目顺序需要保持正确
export const createChoices = ["hybrid", "admin", "nodejs", "cli"];
export const weappChoices = ["sso", "payment"];

export type PresetType = keyof Presets;

const registry =
  process.env.FL_REGISTRY ||
  "https://gitee.com/qexr/registry/raw/master/fl.json";

type ActionType = "create" | "weapp-add";

export const getTemplateUrl = async (
  type: PresetType,
  action: ActionType = "create"
) => {
  const data = await get(registry);

  const presets = data[action];
  if (!(type in presets)) {
    throw new TypeError(
      `模板类型错误: ${type}，${action}目前仅支持 ${Object.keys(presets).join(
        ", "
      )}`
    );
  }
  return presets[type];
};

export default async (url: string, dest: string, context?: any) => {
  ora()
    .start()
    .info(`开始安装${path.parse(url).name}`);

  const templateDir = await load(
    getTemplate(url, context.branch),
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

export const check = (type: string, name: string) => {};
