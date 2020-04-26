const jsonWebToken = require('jsonwebtoken')
const User = require('../models/users')
const {secret} = require('../config')

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
    ctx.body = jsonWebToken.sign({_id, userName}, secret, {
      expiresIn: '1d'  // token过期时间
    })
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
    ctx.body = await User.find()
  }

  async getUserForId(ctx) {
    const {fields} = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
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
      ctx.throw(404)
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
}

module.exports = new UsersCtl()
