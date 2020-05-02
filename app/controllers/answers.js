const Answer = require('../models/answers')
const { extractFields, paginationUtil } = require('../utils/utils')

class AnswersCtl {
  async checkAnswererExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(404, '暂无权限')
    }
    await next()
  }

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if (!answer) { ctx.throw(404, '答案不存在') }
    if (ctx.params.questionId && (answer.questionId !== ctx.params.questionId)) {
      ctx.throw(404, '该问题下无此答案')
    }
    await next()
  }

  async find(ctx) {
    const { page, size } = paginationUtil(ctx.query.page, ctx.query.size)
    const q = new RegExp(ctx.query.q)
    ctx.body = {
      list: await Answer
        .find({ content: q, answerId: ctx.params.answerId })
        .limit(size)
        .skip(page * size)
    }
  }

  async getAnswerById(ctx) {
    const { fields } = ctx.query
    const selectFields = extractFields(fields, ' +')
    ctx.body = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
  }

  async createAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const answerer = ctx.state.user._id
    const questionId = ctx.params.questionId
    ctx.body = await new Answer({...ctx.request.body, answerer, questionId}).save()
  }

  async updateAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    ctx.body = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true})
  }

  async deleteAnswer(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.body = 204
  }
}

module.exports = new AnswersCtl()
