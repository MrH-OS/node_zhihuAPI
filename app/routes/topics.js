const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const {
  getTopicList,
  getTopicById,
  createTopic,
  updateTopic
} = require('../controllers/topics')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', getTopicList)
router.post('/', auth, createTopic)
router.get('/:id', getTopicById)
router.patch('/:id', auth, updateTopic)

module.exports = router
