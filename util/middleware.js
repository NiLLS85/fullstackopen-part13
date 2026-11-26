const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  return next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }
