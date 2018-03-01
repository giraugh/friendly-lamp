// Expects req.user to be set
const checkPermissions = requiredPermissions => (req, res, next) => {
  const user = req.user
  const hasAllPermissions = requiredPermissions.every(perm => user.can(perm))
  if (hasAllPermissions) {
    next()
  } else {
    return res
      .status(401)
      .send('Required permissions not met.')
  }
}

module.exports = checkPermissions
