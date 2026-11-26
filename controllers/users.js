const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).json(user)
})

// Un usuario con su lista de lectura; ?read=true o ?read=false filtra por leídos (13.21 y 13.23)
router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read === 'true' || req.query.read === 'false') {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['read', 'id'],
        where,
      },
    },
  })
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  // Formato del enunciado: cada blog lleva "readinglists" con el estado de lectura y su id
  const { readings, ...rest } = user.toJSON()
  return res.json({
    ...rest,
    readings: readings.map(({ readinglist, ...blog }) => ({
      ...blog,
      readinglists: [readinglist],
    })),
  })
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }
  user.username = req.body.username
  await user.save()
  return res.json(user)
})

module.exports = router
