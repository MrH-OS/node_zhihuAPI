# 基于Koa开发的仿知乎接口

## 技术栈
- [Koa(express升级版)](https://koa.bootcss.com/)
- [Koa-router(路由)](https://github.com/ZijianHe/koa-router)
- [nodemon(热更新)](https://github.com/remy/nodemon)
- [koa-json-error(错误信息处理)](https://www.npmjs.com/package/koa-json-error)
- [koa-parameter(请求参数校验)](https://www.npmjs.com/package/koa-parameter)
- [cross-env(运行跨平台设置和使用环境变量的脚本)](https://www.npmjs.com/package/cross-env)
    + cross-env使得您可以使用单个命令，而不必担心为平台正确设置或使用环境变量。 只要在POSIX系统上运行就可以设置好，而cross-env将会正确地设置它
- [mongoose(连接mongoDB数据库)](https://www.npmjs.com/package/mongoose)
- [koa-jwt(实现用户认证与授权的中间件)](https://www.npmjs.com/package/koa-jwt)
- [koa-body(中间件,支持json,file等)](https://www.npmjs.com/package/koa-body)
- [koa-static(中间件,生成文件链接)](https://www.npmjs.com/package/koa-static)


## 项目启动
```shell script
npm run dev # 启动开发环境
# 此处将nodemon安装于项目中, 通过在package.json中配置start: nodemon index.js  实现npm启动项目,无需全局安装nodemon
npm run serve #启动生产环境
```

## 数据库
使用MongoDB云服务搭建数据库,详情请访问 `https://cloud.mongodb.com/` 查看
