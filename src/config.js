
// #TODO: Get this from ENV
const secret = process.env.HASH_SECRET
if (!secret) {
  throw Error('HASH_SECRET env variable must be set!')
}
module.exports = {
  secret: secret
}
