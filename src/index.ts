#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import cli from "yargs";

// @todo: load registry data

// 注册命令
const fl = cli
  .commandDir("command")
  .demandCommand(1, "")
  .fail(function (msg, err) {
    console.log(err);
    console.log(msg);
    process.exit(1);
  })
  .alias("help", "h")
  .alias("version", "v")
  .help().argv;

export default fl;
