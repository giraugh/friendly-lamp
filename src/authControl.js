const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const {addUser, getUsers} = require('./data')
const config = require('./config')
const User = require('./User')
const validateCaptcha = require('./middleware/validateCaptcha')
const verifyToken = require('./middleware/verifyToken')
const getUser = require('./middleware/getUser')

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
    // Are these creds already taken?
    const users = getUsers()
    const existingUser = users.find(u => u.name === name || u.email === email)
    if (existingUser) {
      return res
        .status(401)
        .send({auth: false})
    }

    // Create User
    const hashedPassword = bcrypt.hashSync(password, 8)
    const user = new User(
      name,
      email,
      hashedPassword
    )
    let token = jwt.sign({ id: User.getUserId(user) }, config.secret, {
      expiresIn: 86400
    })

    res
      .status(200)
      .send({ auth: true, token })

    // Save the user locally
    addUser(user)
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
  const users = getUsers()
  const user = users.find(user => user.email === email)
  if (!user) {
    return res
      .status(404)
      .send('No such user was found.')
  }

  // Validate password
  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid) {
    return res
      .status(401)
      .send({ auth: false, token: null })
  }

  // Create token
  const token = jwt.sign({ id: User.getUserId(user) }, config.secret, {
    expiresIn: 86400
  })

  // Send token
  return res
    .status(200)
    .send({ auth: true, token })
})

module.exports = router
