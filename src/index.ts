#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import cli from 'args';
import { run } from "./generator";

cli
    .option('name', '项目名称')
    .option('type', '项目类型')
    .option('apiPrefix', 'API接口地址')

const [command, name, ...args] = process.argv.slice(2);

const flags = cli.parse(process.argv.concat(name.startsWith("--") ? name : `--name=${name}`));
run({ command, name, ...flags });