class UsersCtl {
  getList(ctx) {
    ctx.set('Allow', 'GET, POST')
    ctx.body = [{ name: '韩梅梅' }, { name: '李雷' }]
  }

  getUserForId(ctx) {
    ctx.body = `用户id: ${ctx.params.id}`
  }

  addUser(ctx) {
    // 参数校验--不满足条件  返回422
    ctx.verifyParams({
      name: { type: 'string', required: true }
    })
    ctx.body = ctx.request.body
  }

  updateUser(ctx) {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      name: { type: 'string', required: true }
    })
    ctx.body = { name: '李雷2' }
  }

  deleteUser(ctx) {
    ctx.verifyParams({
      id: { type: 'number', required: true }
    })
    ctx.status = 204
  }
}

module.exports = new UsersCtl()
