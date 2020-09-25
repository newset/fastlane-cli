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

interface CI_Context {
  publicUrl?: string;
  desc?: string;
  version?: string;
}

export const uploadWeapp = async (context: CI_Context) => {
  const { desc, version } = context;
  const configPath = dir("project.config.json");

  // 检查文件是否存在
  const config = await fs.readJson(configPath, { encoding: "utf-8" });
  const pkg = await fs.readJson(join(cwd, "package.json"), {
    encoding: "utf-8",
  });
  const privateKeyPath = dir(join(config.miniprogramRoot, "app.key"));
  const projectPath = join(cwd, config.miniprogramRoot);

  // 写入key文件
  await fs.outputFile(privateKeyPath, process.env.WEAPP_CI_KEY);
  await fs.outputFile(
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

  const setting = {
    project,
    version: version || pkg.version,
    desc,
    setting: {
      es6: false,
      es7: true,
    },
  };
  // 根据分支选择 robot
  await ci.upload(setting);
};
