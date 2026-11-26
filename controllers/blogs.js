const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  return next()
}

router.get('/', async (req, res) => {
  const where = {}

  // ?search=texto busca en el título y en el autor, sin distinguir mayúsculas
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }
  const blog = await Blog.create({ ...req.body, userId: user.id })
  return res.status(201).json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }
  await req.blog.destroy()
  return res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  const { likes } = req.body
  if (likes === undefined) {
    return res.status(400).json({ error: 'likes missing' })
  }
  req.blog.likes = likes
  await req.blog.save()
  return res.json({ likes: req.blog.likes })
})

module.exports = router
