const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')

const validateCaptcha = require('./middleware/validateCaptcha')
const verifyToken = require('./middleware/verifyToken')
const getUser = require('./middleware/getUser')

const { newUser, getUsers } = require('./getters/users')
const { secret } = require('./config')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.post('/register', validateCaptcha, (req, res) => {
  const {
    name,
    password,
    email
  } = req.body
  if (name && password && email) {
    getUsers()
      .catch(err => {
        console.error('Failed to get users', err)
        res
          .status(500)
          .send({error: err})
      })
      .then(users => {
        // Are these creds already taken?
        const existingUser = users.find(u => u.name === name || u.email === email)
        if (existingUser) {
          return res
            .status(401)
            .send({auth: false, message: 'User already exists.'})
        }

        // Create user
        const hashedPassword = bcrypt.hashSync(password, 8)
        const user = newUser({
          name,
          email,
          password: hashedPassword
        })

        // Chain
        return user.save()
      })
      .catch(err => {
        console.error('Error creating user', err)
        res
          .status(500)
          .send({auth: false, error: err})
      })
      .then(user => {
        // Create token
        let token = jwt.sign({ id: user._id }, secret, {
          expiresIn: 86400
        })

        // Respond with it
        res
          .status(200)
          .send({ auth: true, token })
      })
  } else {
    return res
      .status(400)
      .send('Registration requires name, password and email params.')
  }
})

router.get('/me', verifyToken, getUser, (req, res) => res.send(req.user))

router.post('/login', (req, res) => {
  // Get Body parameters
  const {
    password,
    email
  } = req.body

  // Find the user in question
  getUsers({email})
    .then(users => {
      // We got this user?
      if (!users.length) {
        return res
          .status(404)
          .send('No such user was found.')
      }

      // Get the user
      const user = users[0]

      // Validate password
      const passwordIsValid = bcrypt.compareSync(password, user.password)
      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ auth: false, token: null })
      }

      // Create token
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: 86400
      })

      // Send token
      return res
        .status(200)
        .send({ auth: true, token })
    })
    .catch(err => {
      console.error('There was an error getting users.', err)
      return res
        .status(500)
        .send({ auth: false, error: err })
    })
})

module.exports = router
