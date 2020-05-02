const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/question/:questionId/answer' })
const {
  checkAnswererExist,
  checkAnswerExist,
  find,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer

} = require('../controllers/answers')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, createAnswer)
router.get('/:id', checkAnswerExist, getAnswerById)
router.patch('/:id', auth, checkAnswererExist, updateAnswer)
router.delete('/:id', auth, checkAnswerExist, deleteAnswer)

module.exports = router
