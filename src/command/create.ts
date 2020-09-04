import { load, writeFile, getTemplate } from "../utils";
import { Arguments } from "yargs"
const ora = require('ora');
const glob = require("glob");

export const types = [
    'hybrid',
    'admin',
    'node',
    // 'full',
    // 'ssr'，
    // 'doc'，
]

export const git = "https://git.doctorwork.com/qiexr/public-group/templates";
const ssh = "gitlab.aihaisi.com:qiexr/public-group/templates"

export const templates = {
    'hybrid': "mobile-native",
    'admin': "umi-dash",
    'node': "nodejs",
}

export type ProjectType = typeof templates;

type TempType = keyof ProjectType;

export const getTemplateUrl = (type: number) => {
    const name = types[type] as TempType;
    // return `${git}/-/archive/master/${templates[name]}-master.zip`;
    return `${ssh}/${templates[name]}`
};

export default (args: Arguments) => {

    console.log("object", args);
    run(args)
}

async function run(context: any) {
    ora().start().info(`开始创建${types[context.type]}项目`);

    const dir = await load(getTemplate(context.type), '下载模板', "模板下载完成");

    const files: [string] = glob.sync("./**", {
        cwd: dir,
        dot: true,
        nodir: true
    });

    console.log("开始生成项目文件: ")
    const spinner = ora("拷贝文件: ").start()
    for (let file of files) {
        try {
            writeFile(file, { context, dir })
        } catch (error) {
            spinner.fail(`fail: ${file}`);
            console.log(error)
            return
        }

        spinner.succeed(`copy ${file.replace("./", "")}`);
    }

    spinner.stop();
    console.log("完成")
}