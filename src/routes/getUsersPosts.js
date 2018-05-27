const { errorResponse } = require('../responses')

const getUserPostRoute = (type, getter) =>
  (req, res) => {
    const userId = req.query.id
    console.log('using userId', userId)
    getter({user: userId})
      .then(posts => res.send(posts))
      .catch(errorResponse(`Error getting ${type}s`, 500, res))
  }

module.exports = getUserPostRoute
