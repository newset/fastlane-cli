import { load, writeFile, getTemplate } from "../utils";
import { Arguments } from "yargs"
const ora = require('ora');
const glob = require("glob");

export default (args: Arguments) => {

    console.log("object", args);
    run(args)
}

async function run(context: any) {
    const { _: [handleType], name } = context
    ora().start().info(`开始创建${name}项目`);

    const dir = await load(getTemplate(name, handleType), '下载模板', "模板下载完成");

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
