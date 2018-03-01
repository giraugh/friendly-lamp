const User = require('./models/User')

const newUser = (user) =>
  new User(user)

const getUsers = (query) =>
  User.find(query)

const getUsersById = (id, exemption) =>
  User.findById(id, exemption)

module.exports = {
  newUser,
  getUsers,
  getUsersById
}
