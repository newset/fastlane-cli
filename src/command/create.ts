import scalffold, { PresetType } from "../utils/scalffolder";
import { Argv } from "yargs";
const ora = require("ora");

type deprecateOption = (key: string, mssage: string) => void;

type Context = Argv & {
  type?: string;
};

export const builder = (yargs: Context) => {
  return yargs
    .positional("name", {
      description: "项目名称",
    })
    .options({
      type: {
        choices: [0, 1, 2, "hybrid", "admin", "nodejs", "cli"],
        alias: "t",
        required: true,
        description: "0-hybrid, 1-admin, 2-nodejs, cli",
      },
      apiPrefix: {
        description: "接口前缀",
      },
      dist: {
        description: "构建目录",
      },
    });
};

export async function handler(context: Context) {
  const { name, type } = context;

  let actual = type;
  if (typeof type === "number") {
    actual = ["hybrid", "admin", "nodejs"][type];
  }

  await scalffold(actual as PresetType, name);
}

export const command = "create <name>";

export const desc = "创建项目";

export const deprecateOption = [
  "type",
  // "0, 1, 2 将在下个版本去除，请使用hybrid, admin ,nodejs",
  // 已使用问答模式，可以不需要0，1，2了
  "请使用hybrid, admin, nodejs, cli",
];
