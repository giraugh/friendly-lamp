const { errorResponse } = require('../responses')

const postPostRoute = (type, creator, fields) =>
(req, res) => {
  // Create post with fields from body params
  let post = {}
  for (let field of fields) {
    post[field] = req.body[field]
  }

  // Save new post with user also
  creator({
    ...post,
    user: req.user._id
  }).save()
    .catch(errorResponse(`Error creating ${type}`, 500, res))
    .then(() => res.send({success: true, message: `Succesfully created ${type}!`}))
}

module.exports = postPostRoute
