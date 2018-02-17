const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()

const APP_PORT = process.env.PORT || '3002'

const eventsPath = './public/data/events'
const linksPath = './public/data/links'

const getData = (path, defaultData) => {
  if (!fs.existsSync(path)) {
    return defaultData
  } else {
    let content = fs.readFileSync(path)
    return JSON.parse(content.toString())
  }
}

const saveData = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data))
}

const getLinksData = (subject) => {
  const linksDataPath = path.join(__dirname, `${linksPath}/${subject}.json`)
  const data = getData(linksDataPath, {links: []})
  return data
}

const saveLinks = (subject, data) => {
  const linksDataPath = path.join(__dirname, `${linksPath}/${subject}.json`)
  saveData(linksDataPath, data)
}

const getEventsData = (subject) => {
  const eventsDataPath = path.join(__dirname, `${eventsPath}/${subject}.json`)
  const data = getData(eventsDataPath, {events: []})
  return data
}

const saveEvents = (subject, data) => {
  const eventsDataPath = path.join(__dirname, `${eventsPath}/${subject}.json`)
  saveData(eventsDataPath, data)
}

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

app.post('/new-event', (req, res) => {
  const {name, subject, description, date} = req.query
  if (name && subject && description && date) {
    const data = getEventsData(subject)

    // Add New Event
    data.events.push({
      name,
      description,
      date
    })

    // Re-write
    saveEvents(subject, data)

    res.send('Succesfully uploaded event!')
  } else {
    res
      .status(400)
      .send('Requires valid ?name, ?desc, ?date and ?subject queries')
  }
})

app.post('/new-link', (req, res) => {
  const {link, subject, description, name} = req.query
  if (link && subject && description && name) {
    // Get links
    const data = getLinksData(subject)

    // Add new link
    data.links.push({
      name,
      link,
      description
    })

    // Save links
    saveLinks(subject, data)

    // Inform
    res.send('Succesfully uploaded link!')
  } else {
    res
      .status(400)
      .send('Requires valid ?name, ?link, ?description and ?subject queries')
  }
})

app.listen(APP_PORT, _ => console.log(`Listening on ${APP_PORT}`))
