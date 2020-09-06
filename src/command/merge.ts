import { Argv } from "yargs";

export const handler = (args: Argv) => {
  console.log("object", args);
};

export const builder = () => {};

export const command = "merge";

export const desc = "小程序集成";
