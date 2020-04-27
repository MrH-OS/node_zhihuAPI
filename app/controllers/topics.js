const Topic = require('../models/topics')
const { extractFields, paginationUtil } = require('../utils/utils')

class TopicsCtl {
  async getTopicList(ctx) {
    const { page, size } = paginationUtil(ctx.query.page, ctx.query.size)
    ctx.body = {
      list: await Topic
        .find({topicName: new RegExp(ctx.query.q)})
        .limit(size)
        .skip(page * size),
      total: await Topic.find({topicName: new RegExp(ctx.query.q)}).count(),
      page: page + 1 ,
      size
    }
  }

  async getTopicById(ctx) {
    const { fields } = ctx.query
    const selectFields = extractFields(fields, ' +')
    ctx.body = await Topic.findById(ctx.params.id).select(selectFields)
  }

  async createTopic(ctx) {
    ctx.verifyParams({
      topicName: { type: 'string', required: true },
      avatar: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const { topicName } = ctx.request.body
    const topic = await Topic.findOne({topicName})
    if (topic) { ctx.throw(404, '该话题已存在') }
    ctx.body = await new Topic(ctx.request.body).save()
  }

  async updateTopic(ctx) {
    ctx.verifyParams({
      topicName: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    ctx.body = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true}).select('+introduction')
  }
}

module.exports = new TopicsCtl()
