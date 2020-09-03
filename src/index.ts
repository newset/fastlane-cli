#!/usr/bin/env node
// 两种运行模式
// 1. 全参数传入
// 2. 问答模式
import cli from 'yargs';
import subpackage from "./command/subpackage";
import create from "./command/create";

type Yargs = any;

var argv = cli
    .command(
        'create <name>',
        'create project',
        (yargs: Yargs) => {
            yargs.positional('name', {
                describe: 'Project Name',
                type: 'string',
            })
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
    .command("subpackage <name> [dest]", "安装subpackage", (yargs) => {
        yargs.positional('name', {
            describe: 'Subpackage在仓库中的包名',
            type: 'string',
        }).positional('dest', {
            describe: '包输出的位置，默认为package目录',
            type: 'string',
            default: 'package'
        })
    }, (argv) => {
        subpackage(argv);
    })
    .demandOption("name")
    .argv;