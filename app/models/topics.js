const mongoose = require('mongoose')

const { Schema, model } = mongoose

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  topicName: { type: String, required: true },
  avatar: { type: String, default: 'http://fpoimg.com/100x100?text=avatar' },
  introduction: { type: String, select: false }
}, {timestamps: true})

module.exports = model('Topic', topicSchema)
