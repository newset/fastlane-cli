import { Argv } from "yargs";
import { showLocal } from "../utils/qr";

interface QR_ARGS {
  port: number;
  dir?: string;
  serve: boolean;
}

export const command = "qr";

export const desc = "二维码工具";

export const builder = (yargs: Argv) => {
  return yargs.options({
    port: {
      type: "number",
    },
    serve: {
      type: "boolean",
      defualt: true,
    },
  });
};

export const handler = async (args: Argv & QR_ARGS) => {
  await showLocal(args);
};
