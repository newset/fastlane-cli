// const fl = require("../lib/index").default;
const test = require("ava");
const yargs = require("yargs");
const tools = require("../lib/command/weapp");
const noop = () => {};

const command = yargs.command({ ...tools, handler: noop });

test("boolean minify 命令解析", async (t) => {
  const args = command.parse("fl weapp preview --minify");
  t.is(args.minify, true);
});

test("es7 boolean", async (t) => {
  const args = command.boolean(["es7"]).parse("fl weapp preview --es7 false");

  t.is(args.es7, false);
});
