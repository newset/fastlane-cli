const test = require("ava");
const yargs = require("yargs");
const weapp = require("../lib/command/weapp");
const noop = () => {};

test("create 参数测试", (t) => {
  const parser = yargs
    .command("create <name>", "start lunch train", noop, noop)
    .parse("create temp --type=1");
  t.is(parser.type, 1);
});

test("subpackage 参数", (t) => {
  const sub = yargs
    .command({ ...weapp, handler: noop })
    .parse("weapp add sso --dest=module --branch=develop");
  t.is(sub.name, "sso");
  t.is(sub.dest, "module");
  t.is(sub.branch, "develop");
});
