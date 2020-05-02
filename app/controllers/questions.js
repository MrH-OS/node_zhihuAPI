const Question = require('../models/questions')
const { extractFields, paginationUtil } = require('../utils/utils')

class QuestionsCtl {
  async checkQuestionerExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(404, '暂无权限对其它用户问题进行编辑')
    }
    await next()
  }

  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) { ctx.throw(404, '问题不存在') }
    await next()
  }

  async find(ctx) {
    const { page, size } = paginationUtil(ctx.query.page, ctx.query.size)
    const q = new RegExp(ctx.query.q)
    ctx.body = {
      list: await Question
        .find({ $or: [{ title: q }, { description: q }] })
        .limit(size)
        .skip(page * size)
    }
  }

  async getQuestionById(ctx) {
    const { fields } = ctx.query
    const selectFields = extractFields(fields, ' +')
    ctx.body = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
  }

  async createQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const { title } = ctx.request.body
    const question = await Question.findOne({title})
    if (question) { ctx.throw(404, '该问题已存在') }
    ctx.body = await new Question({...ctx.request.body, questioner: ctx.state.user._id}).save()
  }

  async updateQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    ctx.body = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true})
  }

  async deleteQuestion(ctx) {
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.body = 204
  }
}

module.exports = new QuestionsCtl()
