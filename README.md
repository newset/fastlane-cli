# fastlane-cli

## 安装

```
npm i fastlane-cli -g
```

## 初始化项目

```
fl create [name] --type=0 --apiPrefix=/sso-auth --dist=/rapp/sso-auth
```

- 项目类型 (type)
类型 | 名称 | 说明
---------|----------|---------
 0 | hybrid | 多端通用
 1 | admin | 专注管理后模板
 2 | node | Node端模板

 - dist

编译后代码的存放目录

 - apiPrefix

项目主要api的名称