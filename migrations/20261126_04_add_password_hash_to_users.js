const { DataTypes } = require('sequelize')

// Contraseña propia de cada usuario, guardada solo como hash (la piden las pruebas del curso)
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'password_hash', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'password_hash')
  },
}
