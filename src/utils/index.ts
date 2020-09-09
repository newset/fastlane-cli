import { getTemplateUrl, types } from "../api";
const ora = require("ora");
const template = require("lodash/template");

const glob = require("glob");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");

interface WriterOptions {
  filter?: () => [];
  context: any;
  dir: string;
}

const reg = new RegExp("^./template");
const cwd = path.resolve(__dirname, "..");

export const load = (promise: any, title: string, done?: string) => {
  const spinner = ora(title).start();

  return promise.then((data: any) => {
    spinner.succeed(done);
    return data;
  });
};

function reservedPath(dir: string, file: string) {
  return path.join(dir, file);
}

export function writeFile(file: string, opts: WriterOptions) {
  const { filter, context, dir } = opts;
  // 写入新文件
  const dest = `./${context.name}`;
  const original = fs.readFileSync(path.resolve(dir, file)).toString();
  let compiled = original;
  if (file.match(/(js|ts|jsx|tsx|json|html|yaml|yml)$/)) {
    compiled = template(original, {
      variable: "data",
      interpolate: /<%=([\s\S]+?)%>/g,
    })(context);
  }

  fse.outputFile(reservedPath(dest, file), compiled);
}

export async function getTemplate(
  name: string,
  type: number | string,
  handle: string
) {
  // 获取模板
  const [source, templateName] = getTemplateUrl(type, handle);
  const tempDir = path.join(cwd, "template", templateName);

  fse.removeSync(tempDir);

  await new Promise((resolve, reject) => {
    const command = `git clone git@${source} template/${templateName} --depth 1`;
    require("child_process").exec(command, { cwd }, (err: any) =>
      !err ? resolve() : console.log(err)
    );
  });
  return path.join(tempDir, "template");
}
