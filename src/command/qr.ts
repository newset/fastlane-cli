import { Argv } from "yargs";
import { showLocal } from "../utils/qr";

export const command = "qr";

export const desc = "二维码工具";

export const builder = (yargs: Argv) => {
  return yargs.options({
    port: {
      type: "number",
    },
  });
};

export const handler = async (yargs: Argv) => {
  await showLocal(yargs);
};
