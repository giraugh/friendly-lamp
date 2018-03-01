const Link = require('./models/Link')

const newLink = (link) =>
  new Link(link)

const getLinks = (query) =>
  Link.find(query)

const getLinksById = (id, exemption) =>
  Link.find(id, exemption)

module.exports = {
  newLink,
  getLinks,
  getLinksById
}
