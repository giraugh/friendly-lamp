const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authControl = require('./src/middleware/authControl')
const routes = require('./src/routes/routes')
const headers = require('./src/headers')
const { port, mongoUrl } = require('./src/config')

// Create app
const app = express()
mongoose.connect(mongoUrl)

// Set up app
app.use(headers)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', routes)
app.use('/auth', authControl)

// Connect to mongo then start app
const db = mongoose.connection
db.on('error', (e) => console.error('MongoDB connection error:', e))
db.once('open', () => {
  console.log(`Connected to mongodb on ${mongoUrl}`)
  app.listen(port, _ => {
    console.log(`Listening on ${port}`)
  })
})
