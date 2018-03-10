const Event = require('../models/Event')

const newEvent = (event) =>
  new Event(event)

const getEvents = (query) =>
  Event.find(query)

const getEventById = (id, exemption) =>
  Event.findById(id, exemption)

module.exports = {
  newEvent,
  getEvents,
  getEventById
}
