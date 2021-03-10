/**
 * fl spa upload --from dist/web
 * fl spa publish --from dist/web --target dev --url web2.ex.com/fd
 * fl spa deploy --from dist/web --target dev --url web2.ex.com/fd
 * fl spa mashup --name HIS聚合系统
 */

import { Argv } from "yargs";
import { getPkg } from "../utils";
import { Client } from "../utils/cdn";
import { post } from "../utils/net";
import glob from "glob";
const path = require("path");
const { run } = require("../utils/shell");
const { hashElement } = require("folder-hash");

const assert = require("assert").strict;
const fs = require("fs-extra");

const url = process.env.SPA_CONSOLE;
const graphiql = (query: string, variables: any) => {
  return post("/api/graphiql", {
    prefix: url,
    data: {
      query,
      variables,
    },
  }).then((res) => res.data);
};

export const command = "spa [action]";

export const desc = "SPA平台";

type SPACommand = Argv & {
  action: string;
  from: string;
  cos: string;
  bucket: string;
  region: string;
  url: string;
  tag: string;
  target: string;
  files?: string;
};

export const builder = (yargs: Argv) => {
  return yargs.options({
    action: {
      type: "string",
      choices: ["upload", "deploy", "publish", "mashup"],
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
    files: {
      type: "string",
      description: "文件glob表达式",
      default: "**",
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

function getIndexHtml(from: string) {
  return fs.readFileSync(path.join(from, "index.html"), "utf-8");
}

async function getLastCommit(variables: any) {
  const { bundles }: any = await graphiql(
    `
      query ($app: String, $tag: String) {
        bundles(where: {app: {_eq: $app}, tag: {_eq: $tag}}, order_by: {date: desc}, limit: 1) {
          id
          commit
        }
      }
    `,
    variables
  );
  return bundles[0];
}

async function createBundle(hash: string, args: any) {
  const { name: app, version } = getPkg();
  const files = glob.sync(args.files, {
    nodir: true,
    cwd: args.from,
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
}

const BUILD_FILENAME = "fl.build.txt";

async function upload(args: SPACommand) {
  const elem = await hashElement(args.from, {
    include: [args.files],
    encoding: "hex",
  });

  const hash = elem.hash.substr(8, 16);

  const { name } = getPkg();

  await createBundle(hash, args);
  const client = new Client(args.cos);
  await client.upload({
    from: args.from,
    files: args.files,
    bucket: args.bucket,
    region: args.region,
    prefix: `${name}/${hash}`,
  });
  console.log("上传成功: ", hash);
  fs.writeFileSync(BUILD_FILENAME, hash, "utf-8");
}

async function deploy(args: SPACommand) {
  if (!fs.existsSync(BUILD_FILENAME)) {
    return;
  }
  const { name: app } = getPkg();
  const hash = fs.readFileSync(BUILD_FILENAME, "utf-8");
  const [bundle] = await graphiql(
    `
    query($hash: String!){bundles(where: {hash: {_eq: $hash}}) {
      id
    }}
  `,
    { hash }
  ).then((res: any) => res.bundles);

  await post("/api/deployBundle", {
    prefix: url,
    data: {
      app,
      bundleId: bundle.id,
      urlMatcher: args.url,
      target: args.target,
    },
  });

  console.log("[spa] 发布成功: ", bundle.id, hash);
}

export async function handler(args: SPACommand) {
  assert(process.env.SPA_CONSOLE, "接口地址变量SPA_CONSOLE不能为空");

  switch (args.action) {
    case "upload":
      await upload(args);
      break;
    case "publish":
      await deploy(args);
      break;
    case "deploy":
      await upload(args);
      await deploy(args);
      break;
    default:
  }
}
