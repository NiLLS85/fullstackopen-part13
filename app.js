const express = require('express')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')
const { errorHandler, unknownEndpoint } = require('./util/middleware')
const { TESTING } = require('./util/config')

const app = express()

app.use(express.json())

// Comprobación de que el servidor está en marcha (lo usa wait-on en las pruebas)
app.get('/', (req, res) => {
  res.status(200).send('ok')
})

// Vaciar la base de datos solo existe en modo de pruebas (ejercicio 13.17)
if (TESTING) {
  app.use('/api/reset', require('./controllers/reset'))
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api/logout', logoutRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
