const jwt = require('jsonwebtoken')
const config = require('../config')

const verifyToken = (req, res, next) => {
  // Get the token from the header
  const token = req.headers['x-access-token']
  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: 'No token provided.' })
  } else {
    // Verify the token
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: 'Failed to authenticate token.' })
      } else {
        // Save the id to the request for use in other routes
        req.userId = decoded.id

        // Next route!
        next()
      }
    })
  }
}

module.exports = verifyToken
