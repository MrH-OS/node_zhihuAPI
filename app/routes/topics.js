const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const {
  getTopicList,
  getTopicById,
  createTopic,
  updateTopic,
  getTopicFollowers,
  checkTopicExist
} = require('../controllers/topics')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', getTopicList)
router.post('/', auth, createTopic)
router.get('/:id', checkTopicExist, getTopicById)
router.patch('/:id', auth, checkTopicExist, updateTopic)
router.get('/:id/followers', checkTopicExist, getTopicFollowers)

module.exports = router
