const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const routes = require('./routes')

app.use(bodyParser())
routes(app)

app.listen(8080, () => {
  console.log('Program started, current port is 8080')
})
