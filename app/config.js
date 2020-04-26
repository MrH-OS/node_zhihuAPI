const { mongodbCloudDataBase, secret } = require('../config/global')
console.log(mongodbCloudDataBase)

module.exports = {
  connectionStr: mongodbCloudDataBase,
  secret: secret
}
