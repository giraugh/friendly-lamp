const { getUserById } = require('../getters/users')
const { errorResponse } = require('../responses')

// expects 'id' parameter on req.query
const getUserRoute = () => (req, res) =>
  getUserById(req.query.id, { password: 0, email: 0 })
    .catch(errorResponse(`Error occured while finding user`, 500, res))
    .then(user => {
      // Deconstruct to allow adding other properties
      const {
        _id,
        name,
        permissions
      } = user

      // Get links to other resources
      let events = `/users-events?id=${_id}`
      let links = `/users-links?id=${_id}`

      // Reconstruct with paths
      const response = {
        _id,
        events,
        links,
        name,
        permissions
      }

      // Send response
      res.send(response)
    })

module.exports = getUserRoute
