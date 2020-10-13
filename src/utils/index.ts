const ora = require("ora");
const template = require("lodash/template");

const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const { exec } = require("../utils/shell");
const glob = require("glob");

export interface CreateOptions {
  filter?: () => [];
  context: any;
  dir: string;
  dest: string;
}

const rootDir = path.resolve(__dirname, "..", "..");

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

type CopySetting = {
  dir: string;
  dest: string;
};
export function copyFiles(
  { dir, dest }: CopySetting,
  context?: any,
  cb?: (file: string) => void
) {
  const files: [string] = glob.sync("./**", {
    cwd: dir,
    dot: true,
    nodir: true,
  });

  for (let file of files) {
    // 写入新文件
    const original = fs.readFileSync(path.resolve(dir, file)).toString();
    let compiled = original;
    if (file.match(/(js|ts|jsx|tsx|json|html|yaml|yml.sh)$/)) {
      compiled = template(original, {
        variable: "data",
        interpolate: /<%=([\s\S]+?)%>/g,
      })(context);
    }
    fse.outputFile(reservedPath(dest, file), compiled);
    cb?.(file);
  }
}

export async function getTemplate(
  templateName: string,
  url: string,
  branch = "master"
) {
  // 获取模板
  const tempDir = path.join(rootDir, "template", templateName);

  fse.removeSync(tempDir);

  const command = `git clone -b ${branch} git@${url} --depth 1 template/${templateName}`;
  await exec(command, { cwd: rootDir });
  return path.join(tempDir, "template");
}
