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
  unFollowTopic,
  questionsList,
  likeAnswers,
  unLikeAnswers,
  likingAnswersList,
  disLikingAnswers,
  unDisLikeAnswers,
  disLikeAnswersList,
  collectingAnswers,
  collectingAnswersList,
  unCollectingAnswers
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answers')

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

router.get('/:id/questions', auth, questionsList)

router.post('/:id/likingAnswers', auth, checkAnswerExist, likeAnswers, unDisLikeAnswers)

router.delete('/:id/likingAnswers', auth, checkAnswerExist, unLikeAnswers)

router.get('/:id/likingAnswers', auth, likingAnswersList)

router.post('/:id/disLikeAnswers', auth, checkAnswerExist, disLikingAnswers, unLikeAnswers)

router.delete('/:id/disLikeAnswers', auth, checkAnswerExist, unDisLikeAnswers)

router.get('/:id/disLikeAnswers', auth, disLikeAnswersList)

router.post('/:id/collectAnswers', auth, checkAnswerExist, collectingAnswers)

router.delete('/:id/collectAnswers', auth, checkAnswerExist, unCollectingAnswers)

router.get('/:id/collectAnswers', auth, collectingAnswersList)

module.exports = router
