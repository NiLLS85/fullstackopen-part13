const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  return next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.status(201).json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
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
