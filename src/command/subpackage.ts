import { Arguments } from "yargs"
import cp from 'child_process';
const fs = require('fs-extra');
const path = require('path');

const GitUrl = 'git@gitlab.aihaisi.com:qiexr/public-group'
const cwd = process.cwd()

type Argv = Arguments & {
    name?: string
}

const getSubpackage = (name: string) => {
    return new Promise(resolve => {
        const command = `git clone ${GitUrl}/${name}.git`
        cp.exec(command, {}, (error: Error) => error ? console.log(error) : resolve())
    })
}

const movePackage = (name: string) => {
    return new Promise(resolve => {
        fs.move(`./${name}`, path.join(cwd, 'dist', name)).then(resolve)
    })
}

const run = async (args: Argv) => {
    const { _: [handleType], name } = args
    await getSubpackage(name)
    await movePackage(name)
}

export default (args: Argv) => {
    console.log("executing", args);
    run(args)
}


