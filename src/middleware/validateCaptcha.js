const fetch = require('node-fetch')
const { captchaSecret } = require('../config')

const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify'

const validateCaptcha = (req, res, next) => {
  const response = req.headers['g-recaptcha-response']
  const reqURL = `${RECAPTCHA_URL}?secret=${captchaSecret}&response=${response}`
  fetch(reqURL, {
    method: 'POST'
  }).then(response => response.json())
  .then(data => {
    if (data.success) {
      next()
    } else {
      res
        .status(404)
        .send('Recaptcha failed, suspected bot.')
    }
  })
}

module.exports = validateCaptcha
