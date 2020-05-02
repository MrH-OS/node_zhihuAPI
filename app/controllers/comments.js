const Comment = require('../models/comments')
const { extractFields, paginationUtil } = require('../utils/utils')

class CommentsCtl {
  async checkCommentatorExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(404, '暂无权限')
    }
    await next()
  }

  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) { ctx.throw(404, '评论不存在') }
    if (ctx.params.questionId && (comment.questionId !== ctx.params.questionId)) {
      ctx.throw(404, '该问题下无此评论')
    }
    if (ctx.params.answerId && (comment.answerId !== ctx.params.answerId)) {
      ctx.throw(404, '该答案下无此评论')
    }
    await next()
  }

  async find(ctx) {
    const { page, size } = paginationUtil(ctx.query.page, ctx.query.size)
    const q = new RegExp(ctx.query.q)
    const { questionId, answerId } = ctx.params
    const { rootCommentId } = ctx.query
    ctx.body = {
      list: await Comment
        .find({ content: q, questionId, answerId, rootCommentId })
        .limit(size)
        .skip(page * size)
        .populate('commentator replyToUserId')
    }
  }

  async getCommentById(ctx) {
    const { fields } = ctx.query
    const selectFields = extractFields(fields, ' +')
    ctx.body = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
  }

  async createComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: true },
      replyToUserId: { type: 'string', required: true }
    })
    const commentator = ctx.state.user._id
    const { questionId, answerId } = ctx.params
    ctx.body = await new Comment({...ctx.request.body, commentator, questionId, answerId}).save()
  }

  async updateComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const { content } = ctx.request.body
    ctx.body = await Comment.findByIdAndUpdate(ctx.params.id, {content}, {new: true})
  }

  async deleteComment(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.body = 204
  }
}

module.exports = new CommentsCtl()
