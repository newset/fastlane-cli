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

### 创建项目 CREATE

> 运行命令前，需要保证终端有执行 git clone 的权限

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

#### 参数

- type?: "react" | "vue" | "vuets";
- stylelint?: boolean; 可选参数。是否添加 stylelint 配置，默认为 true
- usenpm?: boolean; 可选参数。是否使用 npm ，默认 false ，false 时使用 yarn

```
// fl lint [--type=react|vue|vuets, default: react] [--stylelint=true, default:true] [--usenpm=true, default: false]

fl lint --type=react --usenpm=true

fl lint --type=vue --usenpm=true

fl lint --type=vuets --usenpm=true
```

### 初始化开发环境 Boot （仅限 Mac 系统）

- 安装 homebrew
- 安装 oh-my-zsh
- 配置 .zshrc

### 小程序工具 WEAPP

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

- 获取 COS token
- 显示端口地址二维码

```
export `fl tool cos | xargs`

fl tool qr --port 8000
```

- 根据`COS_TOKEN_URL`获取 cos token

### SPA 平台

该命令依赖 SPA 平台, 以环境变量形式设定平台地址

export SPA_CONSOLE=http://console.example.com/api
export BUCKET=public-10000230
export BUCKET_REGION=ap-shanghai

```
// 上传
fl spa upload --from lib --cos temp
// 发布
fl spa deploy --from dist/web --tag ${BRANCH} --target dev --matchUrl fd.doctorwork.com
// 添加聚合系统代码
fl spa mashup --name HIS聚合系统
```

### 消息工具

依赖环境变量 ROBOT_URL

- 发送版本更新消息

```
fl message workwechat
```

## 开发

```
yarn global add "file:$(pwd)/"
```

## TODO

- [ ] lint 内容通过单独的仓库进行管理
