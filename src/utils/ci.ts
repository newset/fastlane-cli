const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const ci = require("miniprogram-ci");

const dir = (name: string) => path.join(cwd, name);

export const deploy = async () => {
  const privateKeyPath = dir("app.key");
  const projectPath = dir("project.config.json");
  const config = fs.readFileSync(projectPath);
  // 写入key文件
  fs.writeFile(privateKeyPath, process.env.WEAPP_CI_KEY);
  const project = new ci.Project({
    appid: config.appid,
    type: "miniProgram",
    projectPath,
    privateKeyPath,
    ignores: ["node_modules/**/*"],
  });

  const uploadResult = await ci.upload({
    project,
    version: "1.1.1",
    desc: "hello",
    setting: config.setting,
    onProgressUpdate: console.log,
  });
};
