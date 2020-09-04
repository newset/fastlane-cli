#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import cli from 'yargs';
import subpackage from "./command/subpackage";
import create from "./command/create";
import lint from "./command/lint";

type Yargs = any;

cli
    .command('create <name>', 'create project',
        (yargs: Yargs) => {
            return yargs
                .positional('name', {
                    description: "项目名称"
                })
                .options({
                    'apiPrefix': {
                        alias: "a"
                    },
                    'dist': {
                        alias: 'd'
                    }
                })
        },
        create
    )
    .command("subpackage <name>", "安装subpackage",
        (yargs) => {
            return yargs
                .describe("name", "子包名称")
                .options({
                    'name': {
                        describe: 'Subpackage在仓库中的包名',
                        type: 'string',
                    },
                    'dest': {
                        describe: '包输出的位置，默认为package目录',
                        type: 'string',
                        default: 'package'
                    }
                });
        },
        subpackage
    )
    .command("lint [type]", "添加 lint功能",
        (yargs: Yargs) => {
            return yargs
                .positional('type', {
                    default: "react",
                    choices: ['react', 'vue']
                })
                .options({
                    eslint: {
                        describe: "关闭eslint",
                        default: true,
                        type: "boolean"
                    }
                })
        },
        lint
    )
    .argv;