const express = require('express')
const bodyParser = require('body-parser')
const authControl = require('./src/authControl')
const { establishDirectoryStructure } = require('./src/data')
const routes = require('./src/routes')
const headers = require('./src/headers')
const { port } = require('./src/config')

// Create app
const app = express()

// Set up app
app.use(headers)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', routes)
app.use('/auth', authControl)

// Start app
app.listen(port, _ => {
  establishDirectoryStructure()
  console.log(`Listening on ${port}`)
})
