const parseChangelog = require("changelog-parser");
import { request } from "../net";
const fs = require("fs-extra");
const assert = require("assert").strict;

/**
 * 获取最新版本信息，并通知企业微信群
 */
export const workwechat = async () => {
  assert(process.env.ROBOT_URL, "需要设置通知机器人地址: ROBOT_URL 变量");
  const pkg = fs.readJSONSync("./package.json", "utf8");

  const ROBOT_URL = process.env.ROBOT_URL;
  const data = await parseChangelog({
    filePath: "./CHANGELOG.md",
  });

  const { title, body } = data.versions[0];
  const content = `> <font color="info">项目: ${pkg.name}</font> \n\n # ${title} \n ${body} \n`;
  const options = {
    data: {
      msgtype: "markdown",
      markdown: {
        content,
      },
    },
  };

  await request.post(ROBOT_URL, options);
};
