# fastlane-cli

## 依赖

- Nodejs

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install node
```

## 安装

```
npm i fastlane-cli -g
```

## 功能

### 创建项目

```
fl create [name] --type=0 --apiPrefix=/sso-auth --dist=/rapp/sso-auth
```

> 项目类型 (type)

| 类型        | 名称   | 模板地址                                                                 | 说明           |
| ----------- | ------ | ------------------------------------------------------------------------ | -------------- |
| 0 \| hybrid | hybrid | [hybrid](https://git.doctorwork.com/qiexr/public-group/templates/hybrid) | 多端通用       |
| 1 \| admin  | admin  | [admin](https://git.doctorwork.com/qiexr/public-group/templates/admin)   | 专注管理后模板 |
| 2 \| node   | node   | [nodejs](https://git.doctorwork.com/qiexr/public-group/templates/nodejs) | Node 端模板    |
| cli         | cli    | [cli](https://git.doctorwork.com/qiexr/public-group/templates/cli)       | 命令行 模板    |

#### 模板规范

以 Hybrid 模板为例:

- [package.json](https://git.doctorwork.com/qiexr/public-group/templates/mobile-native/-/blob/master/package.json#L2)

```json
{
  "name": "<%= data.name %>"
}
```

- [src/api/index.ts](https://git.doctorwork.com/qiexr/public-group/templates/mobile-native/-/blob/master/src/api/index.ts#L5)

```js
const api = (url: String) => `<%= data.apiPrefix %>${url}`;
```

更多语法支持，参考 [Lodash/template](https://lodash.com/docs/4.17.15#template) 文档， [中文文档地址](https://www.lodashjs.com/docs/latest#_templatestring-options)

### 添加 Lint

- 添加 husky, lint, changelog 相关依赖
- 添加 commitlint 配置
- 添加 eslint 配置
- 添加 package.json scripts

```
fl lint
```

### 初始化开发环境 Boot （仅限 Mac 系统）

- 安装 homebrew
- 安装 oh-my-zsh
- 配置 .zshrc

### 小程序工具

- 发布版本 release
- 添加子包 add
- 预览小程序 preview

```
# 安装 sso 模块 到 package/sso 目录
fl weapp add sso

# 安装 sso 模块 到 module/auth 目录
fl weapp add sso --dest module/auth

fl weapp upload --desc='发布' --version='1.0.0'

# 二维码模式
fl weapp preview --qr=image
```

### 工具集 Tool

```
export `fl tool cos | xargs `
```

- 根据`COS_TOKEN_URL`获取 cos token

## 开发

```
yarn global add "file:$(pwd)/"
```
