const router = require('express').Router()
const { Readinglist, Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// Añadir un blog a la lista de lectura de un usuario (13.20)
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  if (!blogId || !userId) {
    return res.status(400).json({ error: 'blogId and userId are required' })
  }
  if (!(await Blog.findByPk(blogId))) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (!(await User.findByPk(userId))) {
    return res.status(404).json({ error: 'user not found' })
  }
  if (await Readinglist.findOne({ where: { blogId, userId } })) {
    return res.status(400).json({ error: 'blog is already in the reading list' })
  }
  const reading = await Readinglist.create({ blogId, userId })
  return res.status(201).json(reading)
})

// Marcar como leído un blog de la lista; solo el dueño de la lista (13.22)
router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await Readinglist.findByPk(req.params.id)
  if (!reading) {
    return res.status(404).json({ error: 'reading list entry not found' })
  }
  if (reading.userId !== req.user.id) {
    return res.status(401).json({ error: 'you can only modify your own reading list' })
  }
  if (typeof req.body.read !== 'boolean') {
    return res.status(400).json({ error: 'read must be true or false' })
  }
  reading.read = req.body.read
  await reading.save()
  return res.json(reading)
})

module.exports = router
