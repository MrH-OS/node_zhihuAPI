const User = require('../models/users')

class UsersCtl {
  async getList(ctx) {
    ctx.set('Allow', 'GET, POST')
    ctx.body = await User.find()
  }

  async getUserForId(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user
  }

  async addUser(ctx) {
    // 参数校验--不满足条件  返回422
    ctx.verifyParams({
      name: { type: 'string', required: true }
    })
    ctx.body = await new User(ctx.request.body).save()
  }

  async updateUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user
  }

  async deleteUser(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.status = 204
  }
}

module.exports = new UsersCtl()
