const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter') // 请求体参数校验
const path = require('path')
const mongoose = require('mongoose')
const app = new Koa()
const routes = require('./routes')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => console.log('mongoDB连接成功'))
mongoose.connection.on('error', console.error)

// 自定义配置错误返回信息(json格式)
// app.use(async (ctx, next) => {
//   try {
//     await next()
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500
//     ctx.body = {
//       message: err.message
//     }
//   }
// })
// 使用koa-json-error插件配置错误返回信息(json格式)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(koaBody({
  multipart: true, // 支持文件
  formidable: { // 设置上传文件路径
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true  // 保留扩展名
  }
}))
app.use(parameter(app))
routes(app)

app.listen(8080, () => {
  console.log('Program started, current port is 8080')
})
