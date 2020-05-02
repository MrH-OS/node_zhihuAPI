const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/question' })
const {
  checkQuestionerExist,
  checkQuestionExist,
  find,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion

} = require('../controllers/questions')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, createQuestion)
router.get('/:id', checkQuestionExist, getQuestionById)
router.patch('/:id', auth, checkQuestionerExist, updateQuestion)
router.delete('/:id', auth, checkQuestionExist, deleteQuestion)

module.exports = router
