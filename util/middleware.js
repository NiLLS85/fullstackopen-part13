const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

// Comprueba el token y que su sesión siga abierta en la base de datos (ejercicio 13.24)
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const token = authorization.substring(7)
  try {
    req.decodedToken = jwt.verify(token, SECRET)
  } catch {
    return res.status(401).json({ error: 'token invalid' })
  }

  const session = await Session.findOne({ where: { token }, include: { model: User } })
  if (!session) {
    return res.status(401).json({ error: 'session expired, please log in again' })
  }
  if (session.user.disabled) {
    return res.status(401).json({ error: 'account disabled, please contact admin' })
  }

  req.token = token
  req.user = session.user
  return next()
}

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'referenced user or blog does not exist' })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  return next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { tokenExtractor, errorHandler, unknownEndpoint }
