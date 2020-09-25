import { projectInput } from "../utils/inquirer";
import { handler as create } from "./create";
import { Argv } from "yargs";

type deprecateOption = (key: string, mssage: string) => void;

type InitContext = Argv & {
  type?: string;
};

export const builder = (yargs: InitContext) => {
  return yargs;
};

export async function handler() {
  const context = await projectInput("create");

  await create(context);
}

export const command = "init";

export const desc = "初始化项目";

export const deprecateOption = [
  "type",
  // "0, 1, 2 将在下个版本去除，请使用hybrid, admin ,nodejs",
  // 已使用问答模式，可以不需要0，1，2了
  "请使用hybrid, admin, nodejs, cli",
];
