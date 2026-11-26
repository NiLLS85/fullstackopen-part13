const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

// Si el usuario tiene contraseña propia se compara con su hash; si no, vale la
// contraseña común "secret" del material del curso
const passwordMatches = async (user, password) => {
  if (!user || typeof password !== 'string') {
    return false
  }
  if (user.passwordHash) {
    return bcrypt.compare(password, user.passwordHash)
  }
  return password === 'secret'
}

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ where: { username } })

  if (!(await passwordMatches(user, password))) {
    return res.status(401).json({ error: 'invalid username or password' })
  }
  if (user.disabled) {
    return res.status(401).json({ error: 'account disabled, please contact admin' })
  }

  const userForToken = { username: user.username, id: user.id }
  const token = jwt.sign(userForToken, SECRET)

  // La sesión se guarda en la base de datos para poder cerrarla (13.24)
  await Session.create({ userId: user.id, token })

  return res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
