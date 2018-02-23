
// #TODO: Get this from ENV
const secret = process.env.HASH_SECRET
const port = process.env.PORT || '3002'
if (!secret) { throw Error('HASH_SECRET env variable must be set!') }
module.exports = {
  secret,
  port
}
