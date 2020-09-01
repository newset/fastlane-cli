#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import cli from 'yargs';
import { run } from "./generator";
import subpackage from "./command/subpackage";
import create from "./command/create";

type Yargs = any;

var argv = cli
    .command(
        'create [name]',
        'create project',
        (yargs: Yargs) => {
            return yargs.options({
                'apiPrefix': {
                    alias: "a"
                },
                'dist': {
                    alias: 'd'
                }
            })
        }, (argv) => {
            create(argv);
        }
    )
    .command("subpackage [name]", "add subpackage", () => { }, (argv) => {
        subpackage(argv);
    })
    .demandOption("name")
    .argv;

// .option('name', '项目名称')
// .option('type', '项目类型')
// .option('apiPrefix', 'API接口地址')

// const [command, name, ...args] = process.argv.slice(2);

// const flags = cli.parse(process.argv.concat(name.startsWith("--") ? name : `--name=${name}`));
// run({ command, name, ...flags });