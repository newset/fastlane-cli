/**
 * 小程序发布功能
 * 1、获取cdn session token
 * 2、使用ci发布版本
 * 3、上传 dist/.asset 目录
 *
 * 命令行参数: --version --desc
 * 如果指定 publicUrl， 则上传 dist/.asset目录 到cdn
 * publicUrl 需要保持唯一: /project-name/
 */

const fs = require("fs-extra");
const path = require("path");
const cwd = process.cwd();
const ci = require("miniprogram-ci");

const join = path.join;

const dir = (name: string) => join(cwd, name);

const types: ProjectTypes = {
  miniprogram: "miniProgram",
  plugin: "miniProgramPlugin",
};

interface ProjectTypes {
  miniprogram: string;
  plugin: string;
}

type TypeKeys = keyof ProjectTypes;

interface CIContext {
  publicUrl?: string;
  desc?: string;
  version?: string;
  qr?: string;
  minify?: boolean;
}

function getCIOptions(context: CIContext) {
  const { desc, minify = false } = context;

  return {
    qrcodeFormat: context.qr,
    qrcodeOutputDest: `${process.env.BUILD_ID || "qrcode"}.png`,
    desc: `[${process.env.APP_CONFIG_API_ENV || "prod"}]${desc}`,
    robot: process.env.CI_ROBOT || 30,
    setting: {
      es6: false,
      es7: true,
      minify,
    },
  };
}

export const start = async () => {
  const configPath = dir("project.config.json");

  // 检查文件是否存在
  const config = await fs.readJson(configPath, { encoding: "utf-8" });

  const privateKeyPath = dir(join(config.miniprogramRoot, "app.key"));
  const projectPath = join(cwd, config.miniprogramRoot);

  // 写入key文件
  await fs.writeFileSync(privateKeyPath, process.env.WEAPP_CI_KEY);
  await fs.writeFileSync(
    join(projectPath, "project.config.json"),
    JSON.stringify({ ...config, miniprogramRoot: "./" }, null, "  ")
  );
  // 初始化项目
  const project = new ci.Project({
    appid: config.appid,
    type: types[config.compileType as TypeKeys],
    projectPath,
    privateKeyPath,
    ignores: ["node_modules/**/*", "src"],
  });
  return [project, config];
};

export const upload = async (context: CIContext) => {
  const { version } = context;
  const pkg = await fs.readJson(join(cwd, "package.json"), {
    encoding: "utf-8",
  });

  const [project] = await start();
  // 根据分支选择 robot
  const info = await ci.upload({
    project,
    version: version || pkg.version,
    ...getCIOptions(context),
  });

  console.log(info);
};

export const preview = async (context: CIContext) => {
  const [project] = await start();
  // 根据分支选择 robot
  const info = await ci.preview({
    project,
    ...getCIOptions(context),
  });

  console.log(info);
};

export default {
  upload,
  preview,
};
