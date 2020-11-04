// const fl = require("../lib/index").default;
const test = require("ava");
const yargs = require("yargs");
const tools = require("../lib/command/weapp");
const noop = () => {};

test("boolean minify 命令解析", async (t) => {
  const command = yargs.command({ ...tools, handler: noop });
  const args = command.parse("fl weapp preview --minify");
  t.is(args.minify, true);
});
