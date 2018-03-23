const { errorResponse, failureResponse } = require('../responses')

// id, name, description, link

const putPostRoute = (type, getter, fields, overridePermision) => (req, res) => {
  // Create post with fields from body params
  let post = {}
  for (let field of fields) {
    if (field !== 'id') {
      post[field] = req.body[field]
    }
  }

  // Find the existing post
  getter(req.body.id)
    .then(l => {
      if (!l) { throw new Error() }
      const isMine = req.userId.toString() === l.user.toString()
      const canOverride = req.user.can(overridePermision)
      if (!(isMine || canOverride)) {
        failureResponse(`Unathorized. Permissions not met.`, 401, res)
      } else {
        l = Object.assign(l, post)
        return l.save()
      }
    })
    .then(() => {
      res.send({success: true, message: `Succesfully modified ${type}!`})
    })
    .catch(errorResponse(`Error occured while finding/modifying ${type}`, 500, res))
}

module.exports = putPostRoute
