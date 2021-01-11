/**
 * fl spa deploy --from dist/web --tag ${BRANCH} --target dev --url /fd web1.ex.com/fd web2.ex.com/fd
 * fl spa mashup --name HIS聚合系统
 */

import { Argv } from "yargs";
import { tar } from "../utils/shell";
import { md5 } from "../utils";
import { Client } from "../utils/cdn";
import { post } from "../utils/net";
import glob from "glob";
const path = require("path");
const { run } = require("../utils/shell");

const assert = require("assert").strict;
const fs = require("fs-extra");

export const command = "spa [action]";

export const desc = "SPA平台";

type SPACommand = Argv & {
  from: string;
  cos: string;
  bucket: string;
  region: string;
  url: string;
  tag: string;
  target: string;
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
    tag: {
      type: "string",
      desc: "分支或者Tag",
      default() {
        return run("git rev-parse --abbrev-ref HEAD");
      },
    },
  });
};

function getPkg() {
  const pkg: any = fs.readJsonSync("./package.json");
  return pkg;
}

function getIndexHtml(from: string) {
  return fs.readFileSync(path.join(from, "index.html"), "utf-8");
}

async function getLastCommit(variables: any) {
  const { bundles }: any = await post("/api/graphiql", {
    data: {
      query: `
      query ($app: String, $tag: String) {
        bundles(where: {app: {_eq: $app}, tag: {_eq: $tag}}, order_by: {date: desc}, limit: 1) {
          id
          commit
        }
      }
    `,
      variables,
    },
  });
  return bundles[0];
}

async function sendFiles(args: SPACommand) {
  const tarball = tar.c({ sync: true }, [args.from]).read();
  const hash = md5(tarball);
  const { name } = getPkg();

  const client = new Client(args.cos);
  await client.upload({
    from: `${args.from}/**`,
    bucket: args.bucket,
    region: args.region,
    prefix: `${name}/${hash}`,
  });
  console.log("上传成功: ", hash);
  return { hash };
}

async function deploy(hash: string, args: SPACommand) {
  const url = process.env.SPA_CONSOLE;
  const { name: app, version } = getPkg();
  const files = glob.sync(args.from + "/**", {
    nodir: true,
  });

  // todo: commit, changes
  const commit = run("git rev-parse HEAD");
  const changes = run("git log -1 --format=%s | cat");

  const data = {
    app,
    hash,
    files,
    content: getIndexHtml(args.from),
    tag: args.tag,
    version,
    commit,
    changes,
  };

  const { bundle }: any = await post("/api/createBundle", {
    prefix: url,
    data,
  });

  console.log("[bundle]: ", bundle.id);

  await post("/api/deployBundle", {
    prefix: url,
    data: {
      app,
      bundleId: bundle.id,
      urlMatcher: args.url,
      target: args.target,
    },
  });
}

export async function handler(args: SPACommand) {
  assert(process.env.SPA_CONSOLE, "接口地址变量SPA_CONSOLE不能为空");

  const { hash } = await sendFiles(args);

  await deploy(hash, args);
}
