import { load, writeFile, getTemplate } from "../utils";
import { projectInput } from "../utils/inquirer";
import { Argv } from "yargs";
const ora = require("ora");
const glob = require("glob");

type deprecateOption = (key: string, mssage: string) => void;

type Context = Argv & {
  type?: string;
};

export const builder = (yargs: Context) => {
  return yargs;
  // .positional("name", {
  //   description: "项目名称",
  // })
  // .options({
  //   type: {
  //     choices: [0, 1, 2, "hybrid", "admin", "nodejs", "cli"],
  //     alias: "t",
  //     description: "0-hybrid, 1-admin, 2-nodejs, cli",
  //   },
  //   apiPrefix: {
  //     description: "接口前缀",
  //   },
  //   dist: {
  //     description: "构建目录",
  //   },
  // });
};

export function handler(context: Context) {
  projectInput("create", async (project: any) => {
    const { name, type } = project;
    ora()
      .start()
      .info(`开始创建${name || ""}项目`);

    const dir = await load(
      getTemplate(type, "create"),
      "下载模板",
      "模板下载完成"
    );

    const files: [string] = glob.sync("./**", {
      cwd: dir,
      dot: true,
      nodir: true,
    });

    console.log("开始生成项目文件: ");
    const spinner = ora("拷贝文件: ").start();
    for (let file of files) {
      try {
        writeFile(file, { context: project, dir });
      } catch (error) {
        spinner.fail(`fail: ${file}`);
        console.log(error);
        return;
      }

      spinner.succeed(`copy ${file.replace("./", "")}`);
    }

    spinner.stop();
    console.log("完成");
  });
}

export const command = "create";

export const desc = "创建项目";

export const deprecateOption = [
  "type",
  // "0, 1, 2 将在下个版本去除，请使用hybrid, admin ,nodejs",
  // 已使用问答模式，可以不需要0，1，2了
  "请使用hybrid, admin, nodejs, cli",
];
