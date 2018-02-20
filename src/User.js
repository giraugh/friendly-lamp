const btoa = require('btoa')
const permissions = require('./permissions')

class User {
  constructor (_name, _email, _password) {
    this.name = _name
    this.email = _email
    this.password = _password
    this.permissions = [
      permissions.POST_EVENT,
      permissions.POST_LINK
    ]
  }

  static getUserId (user) {
    return btoa(user.name + user.email + user.password)
  }

  static can (user, permission) {
    return user.permissions.includes(permission)
  }
}

module.exports = User
