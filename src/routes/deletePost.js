const { errorResponse, failureResponse } = require('../responses')

const deletePostRoute = (type, finder, overridePerm) =>
  (req, res) => {
    const {id} = req.body
    finder(id)
      .then(post => {
        if (!post) { throw new Error() }
        const isMine = req.userId.toString() === post.user.toString()
        const canOverride = req.user.can(overridePerm)
        if (!(isMine || canOverride)) {
          failureResponse(`Unathorized. Permissions not met.`, 401, res)
        } else {
          post.remove()
            .then(() => res.send({success: true, message: `Succesfully deleted ${type}`}))
        }
      })
      .then(() => {
        res.send({success: true, message: `Succesfully deleted ${type}!`})
      })
      .catch(errorResponse(`Error occured while finding/removing ${type}`, 500, res))
  }

module.exports = deletePostRoute
