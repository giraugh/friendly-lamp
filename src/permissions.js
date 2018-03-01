const permissions = {
  POST_LINK: 1,
  POST_EVENT: 2
}

const defaultPermissions = [
  permissions.POST_EVENT,
  permissions.POST_LINK
]

module.exports = {
  permissions,
  defaultPermissions
}
