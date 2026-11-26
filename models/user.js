const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {
  // El hash de la contraseña nunca sale en las respuestas de la API
  toJSON() {
    const values = this.get({ plain: true })
    delete values.passwordHash
    return values
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
})

module.exports = User
