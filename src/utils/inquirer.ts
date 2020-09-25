const inquirer = require("inquirer");
const path = require("path");

/**
 * 命令问答模式：问题
 */
const Questions: any = {
  create: [
    {
      type: "list",
      name: "type",
      message: "项目类型",
      choices: () => {
        return ["hybrid", "admin", "nodejs", "cli"];
      },
      default: () => {
        return "admin";
      },
      validate: (val: string) => {
        if (!val) {
          return "请选择项目类型";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "name",
      message: "项目名称",
      default: () => {
        return path.basename(process.cwd());
      },
      validate: (val: string) => {
        if (!val) {
          return "请输入项目名称";
        }
        return true;
      },
    },
    {
      type: "confirm",
      message: "是否创建到当前目录？",
      name: "cwd",
      default: () => false,
    },
  ],
  auth: [],
  boot: [],
  lint: [],
  merge: [],
  subpackage: [],
  xtool: [],
};

/**
 * 执行问答模式
 * @param type 问题的类型，放在当前统一配置，如果有需要自行修改对应的问题
 * @param cb 回调答案{key: 问题的name，value: 对应的值}
 */
export const projectInput = async (type: string) => {
  return inquirer.prompt(Questions[type]);
};
