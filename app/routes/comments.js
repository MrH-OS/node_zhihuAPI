const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({ prefix: '/question/:questionId/answer/:answerId/comments' })
const {
  checkCommentExist,
  checkCommentatorExist,
  createComment,
  updateComment,
  find,
  deleteComment,
  getCommentById
} = require('../controllers/comments')

const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, createComment)
router.get('/:id', checkCommentExist, getCommentById)
router.patch('/:id', auth, checkCommentExist, checkCommentatorExist, updateComment)
router.delete('/:id', auth, checkCommentExist, deleteComment)

module.exports = router
