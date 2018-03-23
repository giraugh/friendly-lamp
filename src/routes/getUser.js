const { getUserById } = require('../getters/users')
const { errorResponse } = require('../responses')

// expects 'id' parameter on req.query
const getUserRoute = () => (req, res) =>
  getUserById(req.query.id, { password: 0, email: 0 })
    .catch(errorResponse(`Error occured while finding user`, 500, res))
    .then(user => res.send(user))

module.exports = getUserRoute
