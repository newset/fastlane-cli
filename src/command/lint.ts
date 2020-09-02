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
const commitlint = `{
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
const eslint = `{
  "extends": "eslint-config-umi",
    "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
}
`

export default () => {

}
