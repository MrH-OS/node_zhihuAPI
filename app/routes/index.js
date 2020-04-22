const fs = require('fs')
// 将当前路由下的所有route通过循环遍历注册到app中
module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}
