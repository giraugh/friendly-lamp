const mongoose = require('mongoose')
const { defaultPermissions } = require('../permissions')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  permissions: {
    type: [Number],
    default: defaultPermissions
  }
})

userSchema.methods.can = function (permission) {
  return this.permissions.includes(permission)
}

module.exports = mongoose.model('user', userSchema)
