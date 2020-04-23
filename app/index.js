const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter') // 请求体参数校验
const app = new Koa()
const routes = require('./routes')

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
app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(bodyParser())
app.use(parameter(app))
routes(app)

app.listen(8080, () => {
  console.log('Program started, current port is 8080')
})
