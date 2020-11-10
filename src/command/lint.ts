// 添加 以下依赖和配置

// commitlint
// prettier
// changelog
// eslint
// script 添加 "version": "standard-version"
import { Argv, Arguments, conflicts } from "yargs";
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

const depsWithType = {
  react: ["eslint-config-airbnb"],
  vue: [
    "@vue/eslint-config-airbnb",
    "@vue/eslint-config-typescript",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint-import-resolver-webpack",
    "eslint-plugin-vue",
  ],
};

// stylelint的依赖
const stylelintDeps = [
  "stylelint",
  "stylelint-order",
  "stylelint-scss",
  "stylelint-config-standard",
  "stylelint-webpack-plugin",
];

// .stylelintrc.js
const stylelint = `module.exports = {
  processors: [],
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-order', 'stylelint-scss'],
  rules: {
    "at-rule-empty-line-before": "always",
    "at-rule-name-case": "lower",
    "block-no-empty": true,
    // scss 语法提示
    // 参考 https://github.com/stylelint/stylelint/issues/3190
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // css书写顺序
    'order/order': [
      'declarations',
      'custom-properties',
      'dollar-variables',
      'rules',
      'at-rules'
    ],
    'order/properties-order': [
      'position',
      'z-index',
       // 其他样式的顺序
    ],
    // 其他规则
    'no-empty-source': null,
  }
};
`;

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
    "extends": "eslint-config-airbnb",
      "parserOptions": {
      "ecmaFeatures": {
        "legacyDecorators": true
      }
    }
  }
  `,
  vue: `const path = require('path');
/**@type {import('eslint').Linter.Config} */
const eslintConfig = {
  root: true,
  env: {
    node: true,
    jquery: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, 'node_modules/@vue/cli-service/webpack.config.js'),
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/prefer-default-export': 'off',
    'func-names': 'off', // 匿名函数
    'prefer-promise-reject-errors': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off', // item._xxx
    'no-plusplus': 'off', // ++
    'guard-for-in': 'off', // for in
    'class-methods-use-this': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
  },
};
module.exports = eslintConfig;
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
  stylelint?: boolean;
  usenpm?: boolean;
};

async function writeConfigFiles(opts: CommandArg) {
  const spinner = ora("添加 依赖").start();
  const type = opts.type;
  const usenpm = opts.usenpm;
  let depsList = Object.keys(deps).concat(depsWithType[type]);
  if (opts.stylelint) {
    depsList = depsList.concat(stylelintDeps);
  }
  const install = usenpm
    ? `npm i -D ${depsList.join(
        " "
      )} --registry=https://registry.npm.taobao.org`
    : `yarn add ${depsList.join(" ")} -D`;
  await new Promise((resolve) =>
    exec(install, (_err, stdout) => resolve(stdout))
  ).then(console.log);

  spinner.succeed("写入 commitlint");
  // 写入 commitlint
  await fs.writeFile("./commitlint.config.js", Buffer.from(commitlint));
  spinner.succeed("写入 eslint");
  // 写入 eslint
  await fs.writeFile("./.eslintrc.js", Buffer.from(eslint[type]));

  if (opts.stylelint) {
    spinner.succeed("写入 stylelint");
    // 写入 stylelint
    fs.writeFile("./.stylelintrc.js", Buffer.from(stylelint));
  }
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
  await writeConfigFiles(opts);
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
      stylelint: {
        describe: "添加stylelint",
        default: true,
        type: "boolean",
      },
      usenpm: {
        describe: "使用npm",
        default: false,
        type: "boolean",
      },
    });
};

export const command = "lint";

export const desc = "添加Lint 设置";
