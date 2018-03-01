// If not production, load from .env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const secret = process.env.HASH_SECRET
if (!secret) { throw Error('HASH_SECRET env variable must be set!') }

const captchaSecret = process.env.CAPTCHA_SECRET
if (!captchaSecret) { throw Error('CAPTCHA_SECRET env variable must be set!') }

const port = process.env.PORT
if (!port) { throw Error('CAPTCHA_SECRET env variable must be set!') }

const mongoUrl = process.env.MONGO_URL
if (!port) { throw Error('MONGO_URL env variable must be set!') }

module.exports = {
  secret,
  port,
  captchaKey: '6LdoHUgUAAAAAAetzFOsNh8zrrnY0B39e3Hr2ggF',
  captchaSecret,
  mongoUrl
}
