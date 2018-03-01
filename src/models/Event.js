const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  subject: String,
  name: String,
  date: Date,
  description: String,
  user: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('event', eventSchema)
