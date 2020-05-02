const jsonWebToken = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {secret} = require('../config')
const { extractFields, paginationUtil } = require('../utils/utils')

class UsersCtl {
  async login(ctx) {
    // 校验参数
    ctx.verifyParams({
      userName: {type: 'string', required: true},
      password: {type: 'string', required: true}
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或密码不正确')
    }
    const {_id, userName} = user
    ctx.state.user = user
    ctx.body = {
      token: jsonWebToken.sign({_id, userName}, secret, {
        expiresIn: '1d'  // token过期时间
      })
    }
  }

  // 中间件--检查是否是当前登录用户
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '暂无权限,请联系管理员添加权限')
    }
    await next()
  }

  // 中间件--检查用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) { ctx.throw(404, '用户不存在') }
    await next()
  }

  async getList(ctx) {
    ctx.set('Allow', 'GET, POST')
    const { page, size } = paginationUtil(ctx.query.page, ctx.query.size)
    ctx.body = {
      list: await User
        .find({userName: new RegExp(ctx.query.q)})
        .limit(size)
        .skip(page * size),
      total: await User.find({userName: new RegExp(ctx.query.q)}).count(),
      page: page + 1,
      size
    }
  }

  async getUserForId(ctx) {
    const { fields } = ctx.query
    const selectFields = extractFields(fields, ' +')
    const populateStr = extractFields(fields)
    const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async addUser(ctx) {
    // 参数校验--不满足条件  返回422
    ctx.verifyParams({
      userName: {type: 'string', required: true},
      password: {type: 'string', required: false}
    })
    const {userName} = ctx.request.body
    const repeatedUser = await User.findOne({userName})
    if (repeatedUser) {
      ctx.throw(409, '用户已存在,请重新输入')
    }
    ctx.body = await new User(ctx.request.body).save()
  }

  async updateUser(ctx) {
    ctx.verifyParams({
      userName: {type: 'string', required: false},
      password: {type: 'string', required: false},
      avatar: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employments: {type: 'array', itemType: 'object', required: false},
      educations: {type: 'array', itemType: 'object', required: false}
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true // 返回更新后的数据
    })
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async deleteUser(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }

  async getFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  async getFollowers(ctx) {
    const users = await User.find({following: ctx.params.id})
    if (!users) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = users
  }

  async follow(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+following')
    const followId = ctx.params.id
    const isInclude = selfUser.following.map(id => id.toString()).includes(followId)
    if (!isInclude) {
      selfUser.following.push(followId)
      selfUser.save()
    }
    ctx.status = 204
  }

  async unFollow(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+following')
    const followId = ctx.params.id
    const index = selfUser.following.map(id => id.toString()).indexOf(followId)
    if (index >= 0) {
      selfUser.following.splice(index, 1)
      selfUser.save()
    }
    ctx.status = 204
  }

  async getFollowingTopic(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.followingTopics
  }

  async followTopic(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+followingTopics')
    const followId = ctx.params.id
    const isInclude = selfUser.followingTopics.map(id => id.toString()).includes(followId)
    if (!isInclude) {
      selfUser.followingTopics.push(followId)
      selfUser.save()
    }
    ctx.status = 204
  }

  async unFollowTopic(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+followingTopics')
    const followId = ctx.params.id
    const index = selfUser.followingTopics.map(id => id.toString()).indexOf(followId)
    if (index >= 0) {
      selfUser.followingTopics.splice(index, 1)
      selfUser.save()
    }
    ctx.status = 204
  }

  async questionsList(ctx) {
    ctx.body = await Question.find({questioner: ctx.params.id})
  }

  async likingAnswersList(ctx) {
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user.likingAnswers
  }

  async likeAnswers(ctx, next) {
    const selfUser = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const likeId = ctx.params.id
    const isInclude = selfUser.likingAnswers.map(id => id.toString()).includes(likeId)
    if (!isInclude) {
      selfUser.likingAnswers.push(likeId)
      selfUser.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: { voteCount: 1 }})
    }
    ctx.status = 204
    await next()
  }

  async unLikeAnswers(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const likeId = ctx.params.id
    const index = selfUser.likingAnswers.map(id => id.toString()).indexOf(likeId)
    if (index >= 0) {
      selfUser.likingAnswers.splice(index, 1)
      selfUser.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: { voteCount: -1 }})
    }
    ctx.status = 204
  }

  async disLikeAnswersList(ctx) {
    const user = await User.findById(ctx.params.id).select('+disLikingAnswers').populate('disLikingAnswers')
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user.disLikingAnswers
  }

  async disLikingAnswers(ctx, next) {
    const selfUser = await User.findById(ctx.state.user._id).select('+disLikingAnswers')
    const disLikeId = ctx.params.id
    const isInclude = selfUser.disLikingAnswers.map(id => id.toString()).includes(disLikeId)
    if (!isInclude) {
      selfUser.disLikingAnswers.push(disLikeId)
      selfUser.save()
    }
    ctx.status = 204
    await next()
  }

  async unDisLikeAnswers(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+disLikingAnswers')
    const disLikeId = ctx.params.id
    const index = selfUser.disLikingAnswers.map(id => id.toString()).indexOf(disLikeId)
    if (index >= 0) {
      selfUser.disLikingAnswers.splice(index, 1)
      selfUser.save()
    }
    ctx.status = 204
  }

  async collectingAnswersList(ctx) {
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user.collectingAnswers
  }

  async collectingAnswers(ctx, next) {
    const selfUser = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const answerId = ctx.params.id
    const isInclude = selfUser.collectingAnswers.map(id => id.toString()).includes(answerId)
    if (!isInclude) {
      selfUser.collectingAnswers.push(answerId)
      selfUser.save()
    }
    ctx.status = 204
    await next()
  }

  async unCollectingAnswers(ctx) {
    const selfUser = await User.findById(ctx.state.user._id).select('+collectingAnswers')
    const answerId = ctx.params.id
    const index = selfUser.collectingAnswers.map(id => id.toString()).indexOf(answerId)
    if (index >= 0) {
      selfUser.collectingAnswers.splice(index, 1)
      selfUser.save()
    }
    ctx.status = 204
  }
}

module.exports = new UsersCtl()
