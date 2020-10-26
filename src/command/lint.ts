// 添加 以下依赖和配置

// commitlint
// prettier
// changelog
// eslint
// script 添加 "version": "standard-version"
import { Argv, Arguments } from "yargs";
const ora = require("ora");

// deps:
const deps = {
  "@commitlint/cli": "^8.3.5",
  "@commitlint/config-conventional": "^8.3.4",
  husky: "^4.2.5",
  prettier: "^1.19.1",
  eslint: "^7.11.0",
  "standard-version": "9.0.0",
  "lint-staged": "^10.3.0",
};

// commitlint.config.js
const commitlint = `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      // prettier-ignore
      ['build', 'ci', 'chore', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'deps'],
    ],
  },
};
`;

// package.json 合并以下内容

const husky = {
  husky: {
    hooks: {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
    },
  },
  "lint-staged": {
    "*.{js,jsx,less,md,json}": ["prettier --write"],
    "*.ts?(x)": ["prettier --parser=typescript --write"],
  },
};

// eslint
const eslint = {
  react: `module.export = {
    "extends": "eslint-config-umi",
      "parserOptions": {
      "ecmaFeatures": {
        "legacyDecorators": true
      }
    }
  }
  `,
  vue: `module.export = {
    "extends": "eslint-config-vue",
      "parserOptions": {
      "ecmaFeatures": {
        "legacyDecorators": true
      }
    }
  }
  `,
};

// 添加 开发相关 script
const scripts = {
  release: "standard-version",
  prettify: "prettier --write",
};

// 当前项目 package.json
const fs = require("fs-extra");

import { exec } from "child_process";

type CommandArg = Arguments & {
  type?: "react" | "vue";
  eslint?: boolean;
};

async function writeConfigFiles() {
  const spinner = ora("添加 依赖").start();
  const type = "react";
  const install = `yarn add ${Object.keys(deps).join(" ")} -D`;
  await new Promise((resolve) =>
    exec(install, (_err, stdout) => resolve(stdout))
  ).then(console.log);

  spinner.succeed("写入 commitlint");
  // 写入 commitlint
  await fs.writeFile("./commitlint.config.js", Buffer.from(commitlint));
  spinner.succeed("写入 eslint");
  // 写入 eslint
  fs.writeFile("./.eslintrc.js", Buffer.from(eslint[type]));
}

async function udpatePackageJson() {
  const spinner = ora("添加 依赖").start();
  // const { type } = opts;

  spinner.succeed("更新 package.json");
  const pkg = require(process.cwd() + "/package.json");
  // 写入 package.json, 并格式化
  Object.assign(pkg, husky, {
    scripts: {
      ...pkg.scripts,
      ...scripts,
    },
    license: "ISC",
    prettier: {
      tabWidth: 2,
    },
  });
  fs.writeFile("./package.json", JSON.stringify(pkg, null, "  "));
  spinner.stop();
}

export const handler = async (opts: CommandArg) => {
  await writeConfigFiles();
  await udpatePackageJson();
};

export const builder = (yargs: Argv) => {
  return yargs
    .positional("type", {
      default: "react",
      choices: ["react", "vue"],
    })
    .options({
      eslint: {
        describe: "关闭eslint",
        default: true,
        type: "boolean",
      },
    });
};

export const command = "lint";

export const desc = "添加Lint 设置";
