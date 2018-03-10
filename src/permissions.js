const permissions = {
  POST_LINK: 1,
  POST_EVENT: 2,
  DELETE_LINK_OWN: 3,
  DELETE_EVENT_OWN: 4,
  DELETE_LINK_OTHER: 5,
  DELETE_EVENT_OTHER: 6,
  MODIFY_LINK_OWN: 7,
  MODIFY_EVENT_OWN: 8,
  MODIFY_LINK_OTHER: 9,
  MODIFY_EVENT_OTHER: 10
}

const defaultPermissions = [
  permissions.POST_EVENT,
  permissions.POST_LINK,
  permissions.DELETE_LINK_OWN,
  permissions.DELETE_EVENT_OWN,
  permissions.MODIFY_EVENT_OWN,
  permissions.MODIFY_LINK_OWN
]

const adminPermissions = defaultPermissions.concat([
  permissions.DELETE_LINK_OTHER,
  permissions.DELETE_EVENT_OTHER
])

const ownerPermissions = adminPermissions.concat([
  permissions.MODIFY_EVENT_OTHER,
  permissions.MODIFY_LINK_OTHER
])

module.exports = {
  permissions,
  defaultPermissions,
  adminPermissions,
  ownerPermissions
}
