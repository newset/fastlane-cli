/**
 * fl spa deploy --from dist/web --tag ${BRANCH} --target dev --matchUrl /fd web1.ex.com/fd web2.ex.com/fd
 * fl spa mashup --name HIS聚合系统
 */

import { Argv } from "yargs";
import { tar } from "../utils/shell";
import { md5 } from "../utils";
import { Client } from "../utils/cdn";
import { post } from "../utils/net";
const assert = require("assert").strict;
const fs = require("fs-extra");

export const command = "spa [action]";

export const desc = "SPA平台";

type SPACommand = Argv & {
  from: string;
  cos: string;
  bucket: string;
  region: string;
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
      choices: ["env", "temp"],
      default: "env",
    },
    region: {
      type: "string",
      desc: "CDN区域",
      default: process.env.BUCKET_REGION,
    },
    bucket: {
      type: "string",
      desc: "CDN bucket名称",
      default: process.env.BUCKET,
    },
  });
};

async function sendFiles(args: SPACommand) {
  const tarball = tar.c({ sync: true }, [args.from]).read();
  const hash = md5(tarball);
  const name: string = fs.readJsonSync("./package.json").name;

  const client = new Client(args.cos);
  const files = await client.upload({
    from: `${args.from}/**`,
    bucket: args.bucket,
    region: args.region,
    prefix: `${name}/${hash}`,
  });
  console.log("上传成功: ", hash);
  return { hash, name, files };
}

async function deploy(name: string, hash: string, files: string[]) {}

export async function handler(args: SPACommand) {
  assert(process.env.BRANCH, "分支变量BRANCH不能为空");
  assert(process.env.SPA_CONSOLE, "接口地址变量SPA_CONSOLE不能为空");

  const { hash, name, files } = await sendFiles(args);

  await deploy(name, hash, files);
}
