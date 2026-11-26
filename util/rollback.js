// Deshace la última migración: npm run migration:down
const { rollbackMigration } = require('./db')

rollbackMigration().then(() => process.exit(0))
