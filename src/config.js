
// #TODO: Get this from ENV
const secret = process.env.HASH_SECRET
if (!secret) { throw Error('HASH_SECRET env variable must be set!') }

const captchaSecret = process.env.CAPTCHA_SECRET
if (!captchaSecret) { throw Error('CAPTCHA_SECRET env variable must be set!') }

const port = process.env.PORT || '3002'
const captchaKey = '6LdoHUgUAAAAAAetzFOsNh8zrrnY0B39e3Hr2ggF'
module.exports = {
  secret,
  port,
  captchaKey,
  captchaSecret
}
