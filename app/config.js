const { mongodbCloudDataBase } = require('../config/global')
console.log(mongodbCloudDataBase)

module.exports = {
  connectionStr: mongodbCloudDataBase
}
