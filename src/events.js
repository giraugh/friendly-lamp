const Event = require('./models/Event')

const newEvent = (event) =>
  new Event(event)

const getEvents = (query) =>
  Event.find(query)

const getEventsById = (id, exemption) =>
  Event.find(id, exemption)

module.exports = {
  newEvent,
  getEvents,
  getEventsById
}
