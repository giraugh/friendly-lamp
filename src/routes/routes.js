const express = require('express')
const verifyToken = require('../middleware/verifyToken')
const checkPermissions = require('../middleware/checkPermissions')
const checkParameters = require('../middleware/checkParameters')
const getUser = require('../middleware/getUser')
const getUserRoute = require('./getUser')
const getUsersPostsRoute = require('./getUsersPosts')
const getPostRoute = require('./getPost')
const putPostRoute = require('./putPost')
const postPostRoute = require('./postPost')
const deletePostRoute = require('./deletePost')
const {
  permissions: {
    POST_EVENT,
    POST_LINK,
    DELETE_LINK_OWN,
    DELETE_EVENT_OWN,
    DELETE_LINK_OTHER,
    DELETE_EVENT_OTHER,
    MODIFY_EVENT_OWN,
    MODIFY_LINK_OWN,
    MODIFY_LINK_OTHER,
    MODIFY_EVENT_OTHER
  }
} = require('../permissions')
const {
  newEvent,
  getEvents,
  getEventById
} = require('../getters/events.js')
const {
  newLink,
  getLinks,
  getLinkById
} = require('../getters/links.js')

// Create router
const router = express.Router()

// Base Route for completion-ness
router.get('/', (req, res) => {
  res.send('Friendly-lamp scholar backend')
})

// 'GET' Routes
router.get('/users', checkParameters('query', ['id']), getUserRoute())
router.get('/events', checkParameters('query', ['subject']), getPostRoute('event', getEvents))
router.get('/links', checkParameters('query', ['subject']), getPostRoute('link', getLinks))
router.get('/users-events', checkParameters('query', ['id']), getUsersPostsRoute('event', getEvents))
router.get('/users-links', checkParameters('query', ['id']), getUsersPostsRoute('link', getLinks))

// 'POST' Routes
const postFields = ['name', 'subject', 'description']
router.post(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([POST_EVENT]),
  checkParameters('body', [...postFields, 'date']),
  postPostRoute('event', newEvent, [...postFields, 'date'])
)

router.post(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([POST_LINK]),
  checkParameters('body', [...postFields, 'link']),
  postPostRoute('link', newLink, [...postFields, 'link'])
)

// 'DELETE' Routes
router.delete(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([DELETE_LINK_OWN]),
  checkParameters('body', ['id']),
  deletePostRoute('link', getLinkById, DELETE_LINK_OTHER)
)

router.delete(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([DELETE_EVENT_OWN]),
  checkParameters('body', ['id']),
  deletePostRoute('event', getEventById, DELETE_EVENT_OTHER)
)

router.put(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([MODIFY_LINK_OWN]),
  checkParameters('body', ['id', 'name', 'description', 'link']),
  putPostRoute('link', getLinkById, ['name', 'description', 'link'], MODIFY_LINK_OTHER)
)

router.put(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([MODIFY_EVENT_OWN]),
  checkParameters('body', ['id', 'name', 'description', 'date']),
  putPostRoute('event', getEventById, ['name', 'description', 'date'], MODIFY_EVENT_OTHER)
)

module.exports = router
