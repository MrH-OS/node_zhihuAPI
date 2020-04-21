const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
// 前缀
const usersRouter = new Router({ prefix: '/users' })

// 多中间件使用
const auth = async (ctx, next) => {
  if (ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}

router.get('/', (ctx) => {
  console.log(ctx)
  ctx.body = '主页'
})

usersRouter.get('/', auth, (ctx) => {
  ctx.body = '用户列表'
})

usersRouter.post('/', auth, (ctx) => {
  ctx.body = '添加用户'
})

usersRouter.get('/:id', auth, (ctx) => {
  ctx.body = `用户id: ${ctx.params.id}`
})

app.use(router.routes())
app.use(usersRouter.routes())

app.listen(8080)
