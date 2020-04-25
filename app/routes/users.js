const Router = require('koa-router')
// 前缀
const router = new Router({ prefix: '/users' })

const { getList, addUser, deleteUser, getUserForId, updateUser } = require('../controllers/users')

// 多中间件使用
const auth = async (ctx, next) => {
  if (ctx.url !== '/users') {
    ctx.throw(401)
  }
  await next()
}

router.get('/', auth, getList)

router.post('/', auth, addUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

router.get('/:id', getUserForId)

module.exports = router
