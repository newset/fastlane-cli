### SPA

- fl spa upload --from dist/web
- fl spa publish --from dist/web --target dev --url web2.ex.com/fd
- fl spa deploy --from dist/web --target dev --url web2.ex.com/fd
- fl spa mashup --name HIS 聚合系统

#### Tag 参数

tag 参数默认获取当前 git 分支，但是在 ci 环境中获取到的始终是 HEAD，所以需要单独设置，比如:

- Gitlab-CI

```
--tag $CI_COMMIT_REF_NAME
```

- Jenkins

```
--tag $BRANCH_NAME
```
