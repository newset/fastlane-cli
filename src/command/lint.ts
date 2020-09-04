// 添加 以下依赖和配置

// commitlint
// prettier
// changelog
// eslint
// script 添加 "version": "standard-version"

// deps: 
const deps = {
  "@commitlint/cli": "^8.3.5",
  "@commitlint/config-conventional": "^8.3.4",
  "husky": "^4.2.5",
  "prettier": "^1.19.1",
  "standard-version": "9.0.0"
}

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
`

// package.json 合并以下内容

const husky = {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  },
  "lint-staged": {
    "*.{js,jsx,less,md,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "prettier --parser=typescript --write"
    ]
  }
}

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
  `
}


// 当前项目 package.json
const pkg = require(process.cwd() + "/package.json");
const fs = require("fs-extra");

import { execSync } from "child_process";

interface LintCommandOptions {
  type: 'react' | 'vue',
  eslint: boolean
}

export default (opts: LintCommandOptions) => {
  const { type } = opts;
  const install = `yarn add ${Object.keys(deps).join(" ")}`;
  execSync(install);
  // 写入 commitlint
  fs.writeFile("./commitlint.config.js", Buffer.from(commitlint));
  // 写入 eslint
  fs.writeFile("./.eslintrc.js", Buffer.from(eslint[type]));

  // 写入 package.json, 并格式化
  Object.assign(pkg, husky, {
    "prettier": {
      "tabWidth": 2
    }
  });
  fs.writeFile("./package.json", JSON.stringify(pkg, null, "  "));
}
