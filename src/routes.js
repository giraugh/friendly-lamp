const express = require('express')
const verifyToken = require('./middleware/verifyToken')
const checkPermissions = require('./middleware/checkPermissions')
const getUser = require('./middleware/getUser')
const { errorResponse, failureResponse } = require('./response')
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
} = require('./permissions')
const {
  newEvent,
  getEvents,
  getEventById
} = require('./getters/events.js')
const {
  newLink,
  getLinks,
  getLinkById
} = require('./getters/links.js')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Friendly-lamp scholar backend')
})

router.get('/events', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    failureResponse('Requires valid ?subject query', 400, res)
  } else {
    getEvents({subject})
      .then(events => res.send(events))
      .catch(errorResponse('Error getting links', 500, res))
  }
})

router.get('/links', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    failureResponse('Requires valid ?subject query', 400, res)
  } else {
    getLinks({subject})
      .then(links => res.send(links))
      .catch(errorResponse('Error getting links', 500, res))
  }
})

router.post(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([POST_EVENT]),
  (req, res) => {
    const {name, subject, description, date} = req.body
    if (name && subject && description && date) {
      // Save new event
      newEvent({
        subject,
        name,
        description,
        date,
        user: req.user._id
      }).save()
        .catch(errorResponse('Error creating event', 500, res))
        .then(() => res.send({success: true, message: 'Succesfully created event!'}))
    } else {
      failureResponse('Requires valid name, description, date and subject params', 400, res)
    }
  }
)

router.post(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([POST_LINK]),
  (req, res) => {
    const {link, subject, description, name} = req.body
    if (link && subject && description && name) {
      newLink({
        subject,
        name,
        description,
        link,
        user: req.user._id
      }).save()
        .catch(errorResponse('Error creating link', 500, res))
        .then(() => res.send({success: true, message: 'Succesfully created link!'}))

      // Inform
      res.send({success: true, message: 'Succesfully uploaded link!'})
    } else {
      failureResponse('Requires valid name, link, description and subject params', 400, res)
    }
  }
)

router.delete(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([DELETE_LINK_OWN]),
  (req, res) => {
    const {id} = req.body
    if (id) {
      getLinkById(id)
        .then(link => {
          if (!link) { throw new Error() }
          const isMine = req.userId.toString() === link.user.toString()
          const canOverride = req.user.can(DELETE_LINK_OTHER)
          if (!(isMine || canOverride)) {
            failureResponse(`Unathorized. Permissions not met.`, 401, res)
          } else {
            link.remove()
              .then(() => res.send({success: true, message: 'Succesfully removed link'}))
          }
        })
        .then(() => {
          res.send({success: true, message: 'Succesfully deleted link!'})
        })
        .catch(errorResponse('Error occured while finding/removing link', 500, res))
    } else {
      failureResponse('Requires valid id param', 400, res)
    }
  }
)

router.delete(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([DELETE_EVENT_OWN]),
  (req, res) => {
    const {id} = req.body
    if (id) {
      getEventById(id)
        .then(event => {
          if (!event) { throw new Error() }
          const isMine = req.userId.toString() === event.user.toString()
          const canOverride = req.user.can(DELETE_EVENT_OTHER)
          if (!(isMine || canOverride)) {
            failureResponse('Unathorized, permissions not met.', 401, res)
          } else {
            event.remove()
              .then(() => res.send({success: true, message: 'Succesfully removed event'}))
          }
        })
        .then(() => {
          res.send({success: true, message: 'Succesfully deleted event!'})
        })
        .catch(errorResponse('Error occured while finding/removing event', 500, res))
    } else {
      failureResponse('Requires valid id param', 400, res)
    }
  }
)

router.put(
  '/links',
  verifyToken,
  getUser,
  checkPermissions([MODIFY_LINK_OWN]),
  (req, res) => {
    const {id, name, description, link} = req.body
    if (id && (name || description || link)) {
      getLinkById(id)
        .then(l => {
          if (!l) { throw new Error() }
          const isMine = req.userId.toString() === l.user.toString()
          const canOverride = req.user.can(MODIFY_LINK_OTHER)
          if (!(isMine || canOverride)) {
            failureResponse(`Unathorized. Permissions not met.`, 401, res)
          } else {
            l = Object.assign(l, {name, description, link})
            return l.save()
          }
        })
        .then(() => {
          res.send({success: true, message: 'Succesfully modified link!'})
        })
        .catch(errorResponse('Error occured while finding/modifying link', 500, res))
    } else {
      failureResponse('Requires valid id param and at least one updating param.', 400, res)
    }
  }
)

router.put(
  '/events',
  verifyToken,
  getUser,
  checkPermissions([MODIFY_EVENT_OWN]),
  (req, res) => {
    const {id, name, description, date} = req.body
    if (id && (name || description || date)) {
      getEventById(id)
        .then(e => {
          if (!e) { throw new Error() }
          const isMine = req.userId.toString() === e.user.toString()
          const canOverride = req.user.can(MODIFY_EVENT_OTHER)
          if (!(isMine || canOverride)) {
            failureResponse(`Unathorized. Permissions not met.`, 401, res)
          } else {
            e = Object.assign(e, {name, description, date})
            return e.save()
          }
        })
        .then(() => {
          res.send({success: true, message: 'Succesfully modified event!'})
        })
        .catch(errorResponse('Error occured while finding/modifying event', 500, res))
    } else {
      failureResponse('Requires valid id param and at least one updating param.', 400, res)
    }
  }
)

module.exports = router
