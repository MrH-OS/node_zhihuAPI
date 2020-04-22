class UsersCtl {
  getList(ctx) {
    ctx.set('Allow', 'GET, POST')
    ctx.body = [{ name: '韩梅梅' }, { name: '李雷' }]
  }

  getUserForId(ctx) {
    ctx.body = `用户id: ${ctx.params.id}`
  }

  addUser(ctx) {
    ctx.body = { name: '王二小' }
  }

  updateUser(ctx) {
    ctx.body = { name: '李雷2' }
  }

  deleteUser(ctx) {
    ctx.status = 204
  }
}

module.exports = new UsersCtl()
