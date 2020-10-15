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

export async function getTemplate(url: string, branch = "master") {
  // 获取模板
  const tempDir = path.join(rootDir, "template", path.parse(url).name);

  fse.removeSync(tempDir);

  const command = `git clone -b ${branch} git@${url} --depth 1`;
  await exec(command, { cwd: path.join(rootDir, "template") });
  return path.join(tempDir, "template");
}

export const colors = {
  bright: "\x1B[1m", // 亮色
  grey: "\x1B[2m", // 灰色
  italic: "\x1B[3m", // 斜体
  underline: "\x1B[4m", // 下划线
  reverse: "\x1B[7m", // 反向
  hidden: "\x1B[8m", // 隐藏
  black: "\x1B[30m", // 黑色
  red: "\x1B[31m", // 红色
  green: "\x1B[32m", // 绿色
  yellow: "\x1B[33m", // 黄色
  blue: "\x1B[34m", // 蓝色
  magenta: "\x1B[35m", // 品红
  cyan: "\x1B[36m", // 青色
  white: "\x1B[37m", // 白色
  blackBG: "\x1B[40m", // 背景色为黑色
  redBG: "\x1B[41m", // 背景色为红色
  greenBG: "\x1B[42m", // 背景色为绿色
  yellowBG: "\x1B[43m", // 背景色为黄色
  blueBG: "\x1B[44m", // 背景色为蓝色
  magentaBG: "\x1B[45m", // 背景色为品红
  cyanBG: "\x1B[46m", // 背景色为青色
  whiteBG: "\x1B[47m", // 背景色为白色
};
