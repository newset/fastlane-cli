#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import yargs from "yargs";

// 注册命令
const fl: any = yargs
  .commandDir("command")
  .demandCommand(1, "")
  .middleware((argv) => {
    if (argv.dryRun) {
      console.log(argv);
      process.exit(0);
    }
  })
  .fail(function (msg, err) {
    err && console.log(err);
    msg && console.log(msg);
    process.exit(1);
  })
  .alias("help", "h")
  .alias("version", "v");

export default fl.help().argv;

export { fl };
