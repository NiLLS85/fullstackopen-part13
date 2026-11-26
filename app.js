const express = require('express')

const blogsRouter = require('./controllers/blogs')
const { errorHandler, unknownEndpoint } = require('./util/middleware')

const app = express()

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
