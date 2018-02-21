const express = require('express')
const btoa = require('btoa')
const bodyParser = require('body-parser')
const authControl = require('./src/authControl')
const verifyToken = require('./src/middleware/verifyToken')
const checkPermissions = require('./src/middleware/checkPermissions')
const getUser = require('./src/middleware/getUser')
const {
  POST_EVENT,
  POST_LINK
} = require('./src/permissions')
const {
  getEventsData,
  getLinksData,
  addEvent,
  addLink,
  establishDirectoryStructure
} = require('./src/data')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/auth', authControl)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const APP_PORT = process.env.PORT || '3002'

app.get('/', (req, res) => {
  res.send('Friendly-lamp scholar backend')
})

app.get('/get-events', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    return res
      .status(400)
      .send('Requires valid ?subject query')
  } else {
    const data = getEventsData(subject)
    res.send(data)
  }
})

app.get('/get-links', (req, res) => {
  const {subject} = req.query
  if (!subject) {
    return res
      .status(400)
      .send('Requires valid ?subject query')
  } else {
    const data = getLinksData(subject)
    res.send(data)
  }
})

app.post(
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
        id: btoa(timestamp + ':' + date)
      })

      res.send('Succesfully uploaded event!')
    } else {
      res
        .status(400)
        .send('Requires valid name, description, date and subject params')
    }
  }
)

app.post(
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
        id: btoa(timestamp + ':' + link)
      })

      // Inform
      res.send('Succesfully uploaded link!')
    } else {
      res
        .status(400)
        .send('Requires valid name, link, description and subject params')
    }
  }
)

app.listen(APP_PORT, _ => {
  establishDirectoryStructure()
  console.log(`Listening on ${APP_PORT}`)
})
