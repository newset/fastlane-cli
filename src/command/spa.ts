/**
 * fl spa deploy --from dist/web --tag ${BRANCH} --target dev --matchUrl /fd web1.ex.com/fd web2.ex.com/fd
 * fl spa mashup --name HIS聚合系统
 */

import { Argv } from "yargs";
import { tar } from "../utils/shell";
import { md5, generateId } from "../utils";
import { Client } from "../utils/cdn";
import { createReadStream } from "fs";
import { assert } from "console";
const fs = require("fs-extra");

export const command = "spa [action]";

export const desc = "SPA平台";

type SPACommand = Argv & {
  from: string;
  cos: string;
};

export const builder = (yargs: Argv) => {
  return yargs.options({
    action: {
      type: "string",
      choices: ["upload", "deploy", "mashup"],
    },
    from: {
      type: "string",
      default: "dist",
    },
    cos: {
      type: "string",
      default: "env",
    },
  });
};

async function sendFiles(args: SPACommand) {
  const tarball = tar.c({ sync: true }, [args.from]).read();
  const hash = md5(tarball);
  const name = fs.readJsonSync("./package.json").name;

  const client = new Client(args.cos);
  await client.upload({
    from: `${args.from}/**`,
    bucket: "sd-1257217952",
    region: "ap-nanjing",
    prefix: `${name}/${hash}`,
  });
  console.log("上传成功: ", hash);
}

async function deploy(hash: string, app: string) {
  const tag = process.env.BRANCH;
  assert(tag, "分支变量BRANCH不能为空");
}

export async function handler(args: SPACommand) {
  await sendFiles(args);
}
