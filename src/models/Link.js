const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
  subject: String,
  name: String,
  link: String,
  description: String,
  user: mongoose.Schema.Types.ObjectId
})

module.exports = mongoose.model('link', linkSchema)
