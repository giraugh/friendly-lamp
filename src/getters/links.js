const Link = require('../models/Link')

const newLink = (link) =>
  new Link(link)

const getLinks = (query) =>
  Link.find(query)

const getLinkById = (id, exemption) =>
  Link.findById(id, exemption)

module.exports = {
  newLink,
  getLinks,
  getLinkById
}
