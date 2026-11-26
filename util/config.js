require('dotenv').config({ quiet: true })

// Con TESTING=true se usa la base de datos de pruebas (ejercicio 13.17)
const TESTING = process.env.TESTING === 'true'

module.exports = {
  TESTING,
  DATABASE_URL: TESTING ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
}
