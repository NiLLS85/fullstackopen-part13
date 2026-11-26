// Ejercicio 13.2: imprime los blogs de la base de datos en la línea de comandos
require('dotenv').config({ quiet: true })
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: (sql) => console.log(sql),
})

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error.message)
  } finally {
    await sequelize.close()
  }
}

main()
