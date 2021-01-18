// const fl = require("../lib/index").default;
const test = require("ava");
const yargs = require("yargs");
const tools = require("../lib/command/tool");
const fs = require("fs-extra");
const { getChangelog } = require("../lib/utils/ci/webhook");
const noop = () => {};

test("tool 命令解析", async (t) => {
  // const args = fl;
  const command = yargs.command({ ...tools, handler: noop });

  const args = command.parse("fl tool cos --from dist/weapp");
  t.is(args.from, "dist/weapp");
});

test("changes", async (t) => {
  const [version] = await getChangelog();
  console.log("v: " + JSON.stringify(version, null, " "));
  t.pass();
});
