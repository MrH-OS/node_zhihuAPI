// const jsonWebToken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const Router = require('koa-router')
// 前缀
const router = new Router({ prefix: '/users' })

const {
  login,
  getList,
  addUser,
  deleteUser,
  getUserForId,
  updateUser,
  checkOwner,
  checkUserExist,
  getFollowing,
  getFollowers,
  follow,
  unFollow,
  getFollowingTopic,
  followTopic,
  unFollowTopic
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')

const { secret } = require('../config')

// 中间件使用--- 判断接口是否带有token--是否有权限
// const auth = async(ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     ctx.state.user = jsonWebToken.verify(token, secret)
//   } catch (err) {
//     ctx.throw(401, err.message)
//   }
//   await next()
// }
const auth = jwt({ secret })

router.post('/login', login)

router.get('/', getList)

router.post('/', addUser)

router.patch('/:id', auth, checkOwner, updateUser)

router.delete('/:id', auth, checkOwner, deleteUser)

router.get('/:id', auth, getUserForId)

router.get('/:id/following', auth, getFollowing)

router.get('/:id/followers', auth, getFollowers)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/following/:id', auth, checkUserExist, unFollow)

router.get('/:id/followingTopic', auth, getFollowingTopic)

router.put('/followingTopic/:id', auth, checkTopicExist, followTopic)

router.delete('/followingTopic/:id', auth, checkTopicExist, unFollowTopic)

module.exports = router
