import { getTemplateUrl } from "../api";
const ora = require('ora');
const template = require("lodash/template");

const glob = require("glob");
const fs = require('fs')
const fse = require('fs-extra')
const path = require("path");

interface WriterOptions {
    filter?: () => []
    context: any,
    dir: string
}

const reg = new RegExp("^./template");
// const cwd = path.resolve(__dirname, "..");
const cwd = process.cwd()

export const load = (promise: any, title: string, done?: string) => {
    const spinner = ora(title).start();

    return promise.then((data: any) => {
        spinner.succeed(done);
        return data;
    });
}

export function writeFile(file: string, opts: WriterOptions) {
    const { filter, context, dir } = opts;
    // 写入新文件
    const dest = `./${context.name}`;
    const original = fs.readFileSync(path.resolve(dir, file)).toString();
    const compiled = template(original, { variable: "data", interpolate: /<%=([\s\S]+?)%>/g })(context);

    fse.outputFile(path.join(dest, file), compiled);
}

export async function getTemplate(name: string, type: string) {
    // 获取模板
    const source = getTemplateUrl(name, type);
    const tempDir = path.join(cwd, 'template', name);

    fse.removeSync(tempDir);

    await new Promise((resolve, reject) => {
        const command = `git clone ${source} template/${name} --depth 1`
        require("child_process").exec(command, { cwd }, (err: any) => !err ? resolve() : console.log(err));
    })
    // 删除.git
    fse.removeSync(path.join(tempDir, ".git"));
    return tempDir;
}
