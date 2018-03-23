const { errorResponse } = require('../responses')

const getPostRoute = (type, getter) =>
  (req, res) => {
    const {subject} = req.query
    getter({subject})
      .then(posts => res.send(posts))
      .catch(errorResponse(`Error getting ${type}s`, 500, res))
  }

module.exports = getPostRoute
