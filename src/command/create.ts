import scalffold, { getTemplateUrl, createChoices } from "../utils/scaffold";
import { Argv } from "yargs";

type CreateContext = {
  name: string;
  type?: string;
  // 控制是否在当前目录创建项目，默认为创建到当前目录下name目录
  cwd?: boolean;
};

export const builder = (yargs: Argv & CreateContext) => {
  return yargs
    .positional("name", {
      description: "项目名称",
    })
    .options({
      type: {
        alias: "t",
        required: true,
        description: "0-hybrid, 1-admin, 2-nodejs, cli",
      },
      cwd: {
        description: "是否在当前目录创建项目，默认为创建到当前目录下name目录",
        type: "boolean",
      },
      compile: {
        description: "是否执行编译",
        type: "boolean",
        default: true,
      },
      interpolate: {
        description: "template 解析符",
        default: "<%#([sS]+?)%>",
        type: "string",
      },
      branch: {
        description: "分支",
      },
    });
};

export async function handler(context: CreateContext) {
  const { name, type, cwd = false } = context;

  let actual = type;
  if (typeof type === "number") {
    actual = createChoices[type];
  }

  const url = await getTemplateUrl(actual, "create");

  await scalffold(url, !cwd ? name : ".", context);
}

export const command = "create <name>";

export const desc = "创建项目";

export const deprecated = [
  "type",
  // "0, 1, 2 将在下个版本去除，请使用hybrid, admin ,nodejs",
  // 已使用问答模式，可以不需要0，1，2了
  "请使用hybrid, admin, nodejs, cli",
];

export const deprecatedOptions = [
  "type",
  // "0, 1, 2 将在下个版本去除，请使用hybrid, admin ,nodejs",
  // 已使用问答模式，可以不需要0，1，2了
  "请使用hybrid, admin, nodejs, cli",
];
