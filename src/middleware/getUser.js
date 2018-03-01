const { getUsersById } = require('../users')

const getUser = (req, res, next) => {
  getUsersById(req.userId, { password: 0 })
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'User not found' })
      } else {
        req.user = user
        next()
      }
    })
    .catch(err => {
      console.error('There was an error getting users.', err)
      return res
        .status(500)
        .send({ auth: false, error: err })
    })
}

module.exports = getUser
