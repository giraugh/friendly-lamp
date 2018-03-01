const express = require('express')
const verifyToken = require('./middleware/verifyToken')
const checkPermissions = require('./middleware/checkPermissions')
const getUser = require('./middleware/getUser')
const {
  permissions: {
    POST_EVENT,
    POST_LINK
  }
} = require('./permissions')
const {
  newEvent,
  getEvents
} = require('./getters/events.js')
const {
  newLink,
  getLinks
} = require('./getters/links.js')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Friendly-lamp scholar backend')
})

router.get('/get-events', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    return res
      .status(400)
      .send({success: false, message: 'Requires valid ?subject query'})
  } else {
    getEvents({subject})
      .then(events => res.send(events))
      .catch(err => {
        console.error('Error getting links', err)
        res
          .status(500)
          .send({error: err})
      })
  }
})

router.get('/get-links', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    return res
      .status(400)
      .send({success: false, message: 'Requires valid ?subject query'})
  } else {
    getLinks({subject})
      .then(links => res.send(links))
      .catch(err => {
        console.error('Error getting links', err)
        res
          .status(500)
          .send({error: err})
      })
  }
})

router.post(
  '/new-event',
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
        .catch(err => {
          console.log('Error creating event', err)
          res
            .status(500)
            .send({success: false, error: err})
        })
        .then(() => res.send({success: true, message: 'Succesfully created event!'}))
    } else {
      res
        .status(400)
        .send({success: false, message: 'Requires valid name, description, date and subject params'})
    }
  }
)

router.post(
  '/new-link',
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
        .catch(err => {
          console.log('Error creating link', err)
          res
            .status(500)
            .send({success: false, error: err})
        })
        .then(() => res.send({success: true, message: 'Succesfully created link!'}))

      // Inform
      res.send({success: true, message: 'Succesfully uploaded link!'})
    } else {
      res
        .status(400)
        .send({success: false, message: 'Requires valid name, link, description and subject params'})
    }
  }
)

module.exports = router
