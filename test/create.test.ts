const { getTemplateUrl, createChoices } = require("../lib/utils/scaffold");
const yargs = require("yargs");
const test = require("ava");
const create = require("../lib/command/create");

const presets = [
  "gitlab.aihaisi.com:qiexr/public-group/templates/hybrid.git",
  "gitlab.aihaisi.com:qiexr/public-group/templates/admin.git",
  "gitlab.aihaisi.com:qiexr/public-group/templates/nodejs.git",
];

const subs = {
  sso: "gitlab.aihaisi.com:qiexr/public-group/subpackage/sso.git",
};

// fl create temp --type=0
// fl create temp --type=2
// fl create temp --type=dash
// fl create temp --type=node
test("测试create命令返回的仓库地址", async (t) => {
  const mobielURL = await getTemplateUrl(createChoices[0]);
  const nodeURL = await getTemplateUrl(createChoices[2]);
  const ssoUrl = await getTemplateUrl("sso", "weapp-add");

  t.is(mobielURL, presets[0]);
  t.is(nodeURL, presets[2]);

  t.is(ssoUrl, subs.sso);
});

test("invalid preset", async (t) => {
  const error = await t.throwsAsync(getTemplateUrl("invalid"));
  t.truthy(error.message.startsWith("模板类型错误"));

  await t.notThrowsAsync(getTemplateUrl("nodejs"));
});

// fl subpackage sso
test("测试subpackage命令返回的仓库地址", async (t) => {
  const subUrl = await getTemplateUrl("sso", "weapp-add");
  t.is(subUrl, subs.sso);
});
