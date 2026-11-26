const router = require('express').Router()
const { sequelize } = require('../util/db')

// Vacía todas las tablas de la aplicación y reinicia los contadores de id
router.post('/', async (req, res) => {
  await sequelize.query(
    'TRUNCATE TABLE sessions, readinglists, blogs, users RESTART IDENTITY CASCADE'
  )
  res.status(204).end()
})

module.exports = router
