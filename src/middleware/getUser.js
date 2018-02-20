const {getUsers} = require('../data')
const User = require('../User')

const getUser = (req, res, next) => {
  const users = getUsers().map(user => Object.assign(user, {
    password: 0,
    id: User.getUserId(user)
  }))
  const user = users.find(user => user.id === req.userId)
  if (user) {
    req.user = user
    next()
  } else {
    return res
      .status(401)
      .send('No such user was found.')
  }
}

module.exports = getUser
