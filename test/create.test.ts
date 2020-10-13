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
  const mobielURL = getTemplateUrl(createChoices[0]);
  const nodeURL = getTemplateUrl(createChoices[2], "create");
  const nodeNameURL = getTemplateUrl("nodejs", "create");

  t.is(mobielURL, presets[0]);
  t.is(nodeURL, presets[2]);

  t.is(nodeNameURL, presets[2]);
});

// fl subpackage sso
test("测试subpackage命令返回的仓库地址", async (t) => {
  const subUrl = getTemplateUrl("sso", "subpackage");
  t.is(subUrl, subs.sso);
});

test("create参数检查", async (t) => {
  const command = () => {
    return yargs.command(create.command, create.desc, create.builder);
  };

  t.throws(
    () => {
      command().parse("create test --type=err", {}, (err) => {
        if (err) {
          throw new TypeError("🦄");
        }
      });
    },
    { instanceOf: TypeError }
  );

  t.notThrows(() => {
    command().parse("create test --type=nodejs");
  });
});
