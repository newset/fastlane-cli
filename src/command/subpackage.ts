import { Arguments } from "yargs"
import cp from 'child_process';
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

import { getTemplateUrl } from '../api'
import { load } from "../utils";

const GitUrl = 'git@gitlab.aihaisi.com:qiexr/public-group'
const cwd = process.cwd()

type Argv = Arguments & {
    name?: string,
    dest?: string
}

const getSubpackage = async (name: string, handleType: string,) => {
    const url = getTemplateUrl(name, handleType)
    await new Promise(resolve => {
        const command = `git clone ${url} --depth 1`
        // 删除.git
        cp.exec(command, {}, (error: Error) => error ? console.log(error) : resolve())
    })
    await fs.remove(`./${name}/.git`)
    await fs.remove(`./${name}/.gitignore`)
}

const movePackage = (tempDir: string, destination: string) => fs.move(tempDir, destination)


const run = async (args: Argv) => {
    const { _: [handleType], name, dest } = args
    ora().start().info(`开始安装${name}插件`);

    const tempDir = path.join(cwd, name)
    const destination = path.join(cwd, dest, name)
    await load(getSubpackage(name, handleType), '下载插件', '插件下载完毕')

    await movePackage(tempDir, destination)
}

export default (args: Argv) => {
    console.log("executing", args);
    run(args)
}


