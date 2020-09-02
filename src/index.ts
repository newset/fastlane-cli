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
    .command("subpackage [name]", "add subpackage", (yargs) => {

    }, (argv) => {
        subpackage(argv);
    })
    .demandOption("name")
    .argv;