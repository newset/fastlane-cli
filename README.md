# fastlane-cli


## 安装

```
npm i fastlane-cli -g
```

## 初始化项目

```
fl create [name] --type=0 --apiPrefix=/sso-auth --dist=/rapp/sso-auth
```

> 项目类型 (type)
  
类型 | 名称 |  模板地址|说明
---------|----------|---------
 0 | hybrid |  [mobile-native](https://git.doctorwork.com/qiexr/public-group/templates/mobile-native) | 多端通用
 1 | admin | [umi-dash](https://git.doctorwork.com/qiexr/public-group/templates/umi-dash) |专注管理后模板
 2 | node | [nodejs](https://git.doctorwork.com/qiexr/public-group/templates/nodejs) | Node端模板

> dist

编译后代码的存放目录

> apiPrefix

项目主要api的名称

## 模板规范

以Hybrid 模板为例:

- [package.json](https://git.doctorwork.com/qiexr/public-group/templates/mobile-native/-/blob/master/package.json#L2) 
```json
{
    "name": "<%= data.name %>"
}
```
-  [src/api/index.ts](https://git.doctorwork.com/qiexr/public-group/templates/mobile-native/-/blob/master/src/api/index.ts#L5)

```js
const api = (url: String) => `<%= data.apiPrefix %>${url}`;
```

更多语法支持，参考 [Lodash/template](https://lodash.com/docs/4.17.15#template) 文档， [中文文档地址](https://www.lodashjs.com/docs/latest#_templatestring-options)