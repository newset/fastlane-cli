const test = require("ava");
const yargs = require("yargs");

test("create 参数测试", (t) => {
  const parser = yargs
    .command(
      "fl create <name>",
      "start lunch train",
      function () {},
      function (argv) {
        console.log(argv.restaurant, argv.time);
      }
    )
    .parse("fl create temp --type=1");

  t.is(parser.type, 1);
});
