const { getTemplateUrl } = require("../lib/api");
const test = require("ava");

const presets = [
  "https://git.doctorwork.com/qiexr/public-group/templates/mobile-native",
  "https://git.doctorwork.com/qiexr/public-group/templates/umi-dash",
  "https://git.doctorwork.com/qiexr/public-group/templates/nodejs",
];

const subs = {
  sso: "git@gitlab.aihaisi.com:qiexr/public-group/subpackage/sso",
};

// fl create temp --type=0
// fl create temp --type=2
test("测试create命令返回的仓库地址", async (t) => {
  const mobielURL = getTemplateUrl("create", 0);
  const nodeURL = getTemplateUrl("create", 2);

  t.is(mobielURL, presets[0]);
  t.is(nodeURL, presets[2]);
});

// fl subpackage sso
test("测试subpackage命令返回的仓库地址", async (t) => {
  const subUrl = getTemplateUrl("subpackage", "sso");
  t.is(subUrl, subs.sso);
});
