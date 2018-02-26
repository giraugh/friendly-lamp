const express = require('express')
const btoa = require('btoa')
const verifyToken = require('./middleware/verifyToken')
const checkPermissions = require('./middleware/checkPermissions')
const getUser = require('./middleware/getUser')
const {
  POST_EVENT,
  POST_LINK
} = require('./permissions')
const {
  getEventsData,
  getLinksData,
  addEvent,
  addLink
} = require('./data')

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
    const data = getEventsData(subject)
    res.send(data)
  }
})

router.get('/get-links', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    return res
      .status(400)
      .send({success: false, message: 'Requires valid ?subject query'})
  } else {
    const data = getLinksData(subject)
    res.send(data)
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
      // Get Current Time
      const timestamp = Date.now()

      // Save new event
      addEvent(subject, {
        name,
        description,
        date,
        timestamp,
        id: btoa(timestamp + ':' + date),
        author: req.user.id
      })

      res.send({success: true, message: 'Succesfully uploaded event!'})
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
      // Get Current Time
      const timestamp = Date.now()

      // Save new link
      addLink(subject, {
        name,
        link,
        description,
        timestamp,
        id: btoa(timestamp + ':' + link),
        author: req.user.id
      })

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
