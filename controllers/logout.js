const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// Cierra todas las sesiones del usuario: ninguno de sus tokens vuelve a valer
router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { userId: req.user.id } })
  res.status(204).end()
})

module.exports = router
