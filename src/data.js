const fs = require('fs')
const path = require('path')

const DATA_PATH = '../data'
const EVENTS_PATH = DATA_PATH + '/events'
const LINKS_PATH = DATA_PATH + '/links'
const USERS_PATH = DATA_PATH + '/users.json'

const establishDirectoryStructure = () => {
  if (!fs.existsSync(path.join(__dirname, DATA_PATH))) {
    fs.mkdirSync(path.join(__dirname, DATA_PATH))
  }
  if (!fs.existsSync(path.join(__dirname, EVENTS_PATH))) {
    fs.mkdirSync(path.join(__dirname, EVENTS_PATH))
  }
  if (!fs.existsSync(path.join(__dirname, LINKS_PATH))) {
    fs.mkdirSync(path.join(__dirname, LINKS_PATH))
  }
}

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

const getEventsData = (subject) => {
  const eventsDataPath = path.join(__dirname, `${EVENTS_PATH}/${subject}.json`)
  const data = getData(eventsDataPath, {events: []})
  return data
}

const getLinksData = (subject) => {
  const linksDataPath = path.join(__dirname, `${LINKS_PATH}/${subject}.json`)
  const data = getData(linksDataPath, {links: []})
  return data
}

const getUsersData = () => {
  const usersDataPath = path.join(__dirname, USERS_PATH)
  const data = getData(usersDataPath, {users: []})
  return data
}

const saveEvents = (subject, data) => {
  const eventsDataPath = path.join(__dirname, `${EVENTS_PATH}/${subject}.json`)
  saveData(eventsDataPath, data)
}

const saveLinks = (subject, data) => {
  const linksDataPath = path.join(__dirname, `${LINKS_PATH}/${subject}.json`)
  saveData(linksDataPath, data)
}

const saveUsers = (data) => {
  const usersDataPath = path.join(__dirname, USERS_PATH)
  saveData(usersDataPath, data)
}

const addEvent = (subject, event) => {
  const data = getEventsData(subject)
  data.links.push(event)
  saveEvents(subject, data)
}

const addLink = (subject, link) => {
  const data = getLinksData(subject)
  data.links.push(link)
  saveLinks(subject, data)
}

const addUser = (user) => {
  const data = getUsersData()
  data.users.push(user)
  saveUsers(data)
}

const getUsers = () => {
  const {users} = getUsersData()
  return users
}

module.exports = {
  saveEvents,
  saveLinks,
  saveUsers,
  getEventsData,
  getLinksData,
  getUsersData,
  addUser,
  addEvent,
  addLink,
  getUsers,
  establishDirectoryStructure
}
